import {
  ComponentObjectPropsOptions,
  normalizePropOptions,
  NormalizePropsOption
} from './normalizeProps'

/**
 * Create a factory function for props that can override their default props.
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
