import { isArray, isPlainObject } from '@vue/shared'
import type { ComponentPropsOptions, PropType } from 'vue-module-demi'

export type ResolvePropConstructor<T> = T extends string
  ? StringConstructor
  : T extends number
  ? NumberConstructor
  : T extends symbol
  ? SymbolConstructor
  : T extends bigint
  ? BigIntConstructor
  : T extends Function
  ? FunctionConstructor
  : T extends any[]
  ? ArrayConstructor
  : T extends null
  ? null
  : T extends object
  ? ObjectConstructor
  : any

export type ResolvePropType<T> =
  | ResolvePropConstructor<T>
  | ResolvePropConstructor<T>[]
  | true
  | null

export type ResolvePropOptions<T> = {
  [K in keyof T]-?:
    | {
        type: ResolvePropConstructor<NonNullable<T[K]>>
        required: Partial<Pick<T, K>> extends Pick<T, K> ? true : false
      }
    | ResolvePropType<NonNullable<T[K]>>
}

export const definePropType = <T>(
  type?: ResolvePropType<T> | { type: ResolvePropType<T> }
): PropType<T> => type as PropType<T>

export type ComponentObjectPropsOptions = ComponentPropsOptions & Record<string, any>

export type NormalizePropsOption<
  T extends ComponentObjectPropsOptions[keyof ComponentObjectPropsOptions] | undefined
> = T extends PropType<any>
  ? {
      type: T
    }
  : T

export type NormalizePropsOptions<T extends ComponentPropsOptions> = T extends string[]
  ? Record<T[number], {}>
  : {
      [K in keyof T]: NormalizePropsOption<T[K]>
    }

/**
 * Normalized props option to `ObjectPropsOption`
 * @example
 * ```ts
 * // PropConstructor | Null
 * normalizePropOptions([String, Array]) => {
 *   type: [String, Array]
 * }
 * // PropOptions
 * normalizePropOptions({}) => {}
 * ```
 */
export function normalizePropOptions<
  T extends ComponentObjectPropsOptions[keyof ComponentObjectPropsOptions]
>(prop?: T): NormalizePropsOption<T> {
  return (isPlainObject(prop) ? prop : { type: prop }) as NormalizePropsOption<T>
}

/**
 * Normalized props options to `ObjectPropsOptions`
 * @example
 * ```ts
 * // String props
 * normalizePropsOptions(['foo', 'bar']) => {
 *   foo: {},
 *   bar: {}
 * }
 * // Object props
 * normalizePropsOptions({
 *   foo: String,
 *   bar: {
 *     type: Number
 *   }
 * }) => {
 *   foo: {
 *     type: String
 *   },
 *   bar: {
 *     type: Number
 *   }
 * }
 * ```
 */
export function normalizePropsOptions<T extends ComponentPropsOptions>(
  props: T
): NormalizePropsOptions<T> {
  const normalized = {} as NormalizePropsOptions<T>

  if (isArray(props)) {
    for (let i = 0; i < props.length; i++) {
      normalized[props[i]] = {}
    }
  } else if (props) {
    for (const key in props) {
      normalized[key] = normalizePropOptions(props[key]) as NormalizePropsOption<any>
    }
  }

  return normalized
}

export type WithDefaultProps<
  T extends ComponentObjectPropsOptions,
  D extends Partial<Record<keyof T, unknown>> = {}
> = {
  [P in keyof T]-?: unknown extends D[P]
    ? T[P]
    : NormalizePropsOption<T[P]> extends Record<string, unknown>
    ? Omit<NormalizePropsOption<T[P]>, 'default'> & {
        default: D[P]
      }
    : {
        type: null
        default: D[P]
      }
}

export interface PropsFactory<T extends ComponentObjectPropsOptions> {
  // overload 1: without passing default props, props will be returned as is
  (): T
  // overload 2: merge default props and props
  <D extends Partial<Record<keyof T, unknown>>>(defaultProps: D): WithDefaultProps<T, D>
  // implement
  <D extends Partial<Record<keyof T, unknown>>>(defaultProps?: D): T | WithDefaultProps<T, D>
}

/**
 * Create a factory function for props that can override their default props
 * @example
 * ```ts
 * const withButtonProps = createPropsFactory({
 *   type: String,
 *   size: {
 *     type: String,
 *     default: 'biggest'
 *   }
 * })
 *
 * const PrimaryButtonProps = withButtonProps({
 *   type: 'primary',
 *   size: 'medium'
 * })
 *
 * // snapshot
 * PrimaryButtonProps = {
 *   type: {
 *     type: String,
 *     default: 'primary'
 *   },
 *   size: {
 *     type: String,
 *     default: 'medium'
 *   }
 * }
 * ```
 */
export function createPropsFactory<T extends ComponentObjectPropsOptions>(props: T) {
  const getNormalizedProp = (prop: string) => normalizePropOptions(props[prop])

  return ((defaultProps) => {
    if (!defaultProps) {
      return props
    }

    return Object.keys(props).reduce<any>((merged, prop) => {
      if (prop in defaultProps) {
        merged[prop] = {
          ...getNormalizedProp(prop),
          default: defaultProps[prop]
        }
      } else {
        merged[prop] = props[prop]
      }
      return merged
    }, {})
  }) as PropsFactory<T>
}

/**
 * Create a factory function for props that can override their default props
 * @example
 * ```ts
 * const ButtonProps = {
 *   type: String,
 *   size: {
 *     type: String,
 *     default: 'biggest'
 *   }
 * }
 *
 * const PrimaryButtonProps = withDefaultProps(props, {
 *   type: 'primary',
 *   size: 'medium'
 * })
 *
 * // snapshot
 * PrimaryButtonProps = {
 *   type: {
 *     type: String,
 *     default: 'primary'
 *   },
 *   size: {
 *     type: String,
 *     default: 'medium'
 *   }
 * }
 * ```
 */
export function withDefaultProps<T extends ComponentObjectPropsOptions>(
  props: T
): WithDefaultProps<T>
export function withDefaultProps<
  T extends ComponentObjectPropsOptions,
  D extends Partial<Record<keyof T, unknown>>
>(props: T, defaultProps: D): WithDefaultProps<T, D>
export function withDefaultProps<
  T extends ComponentObjectPropsOptions,
  D extends Partial<Record<keyof T, unknown>>
>(props: T, defaultProps?: D): WithDefaultProps<T, D> {
  return createPropsFactory(props)(defaultProps) as WithDefaultProps<T, D>
}

interface PropOptions {
  type?: PropType<any> | true | null
  required?: boolean
  default?: any
}

export type Required<T> = T extends PropType<any>
  ? {
      type: T
      required: true
    }
  : T extends PropOptions
  ? Omit<T, 'required'> & {
      required: true
    }
  : never

/**
 * Make prop required
 * @example
 * ```ts
 * required(String) -> { type: String, required: true }
 * ```
 */
export function required<T extends PropType<any> | PropOptions>(options?: T): Required<T> {
  return {
    ...normalizePropOptions(options),
    required: true
  } as any as Required<T>
}
