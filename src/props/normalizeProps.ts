import { isArray, isPlainObject } from '@vue/shared'
import type { ComponentPropsOptions, PropType } from 'vue-demi'

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
 * normalized props option to `ObjectPropsOption`
 * @example
 * ```ts
 * // PropConstructor
 * normalizePropOptions([String, Array]) => {
 *   type: [String, Array]
 * }
 * // PropOptions | Null
 * normalizePropOptions(null) => null
 * ```
 */
export function normalizePropOptions<
  T extends ComponentObjectPropsOptions[keyof ComponentObjectPropsOptions]
>(prop?: T): NormalizePropsOption<T> {
  return (isPlainObject(prop) ? prop : { type: prop }) as NormalizePropsOption<T>
}

/**
 * normalized props options to `ObjectPropsOptions`
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
