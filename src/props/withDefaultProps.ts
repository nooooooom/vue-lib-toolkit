import { createPropsFactory, WithDefaultProps } from './createPropsFactory'
import type { ComponentObjectPropsOptions } from './normalizeProps'

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
