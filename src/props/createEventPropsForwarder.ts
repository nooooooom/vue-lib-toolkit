import { computed, ComputedRef, ExtractPropTypes, getCurrentInstance } from 'vue-demi'

import { useListenersWithProps } from '../composables'
import type { ComponentInternalInstance } from '../types'
import { getListenerProps, isHandlerKey } from '../listeners'
import type { ComponentObjectPropsOptions } from './normalizeProps'

export type ExtractEventPropKeys<T extends ComponentObjectPropsOptions> = {
  [K in keyof T]: K extends `on${string}` ? K : never
}[keyof T]

export function extractListenerPropKeys<
  T extends ComponentObjectPropsOptions,
  K extends keyof T = ExtractEventPropKeys<T>
>(props: T): K[] {
  return Object.keys(props).filter((key) => isHandlerKey(key)) as K[]
}

export interface EventPropsForwarder<
  T extends ComponentObjectPropsOptions,
  K extends keyof T = ExtractEventPropKeys<T>
> {
  props: Pick<T, K>
  forwardWithProps: (props: Record<string, any>) => ExtractPropTypes<Pick<T, K>>
  forward: (instance?: ComponentInternalInstance) => ExtractPropTypes<Pick<T, K>>
  useForward: (instance?: ComponentInternalInstance) => ComputedRef<ExtractPropTypes<Pick<T, K>>>
}

/**
 * Extract the listeners' props in props options,
 * and provide emit functions that can be used in the component.
 * @example
 * ```ts
 * const TooltipProps = {
 *   ...
 *   content: [String, Object],
 *   onClickOutside: Function as PropType<(event: MouseEvent) => void>,
 *   onOpen: Function as PropType<() => void>
 *   ...
 * } as const
 *
 * const TooltipListenerPropsForwarder = createListenerPropsForwarder(TooltipProps)
 *
 * // snapshot
 * TooltipListenerPropsForwarder.props = {
 *   onClickOutside: Function as PropType<(event: MouseEvent) => void>,
 *   onOpen: Function as PropType<() => void>
 * }
 *
 * // NOTE: Regardless of whether listener props are passed in the component,
 * // we will define a function to emit in forwards.
 *
 * TooltipListenerPropsForwarder.forwards = {
 *   onClickOutside: (event: MouseEvent) => void,
 *   onOpen: () => void
 * }
 * ```
 */
export function createListenerPropsForwarder<T extends ComponentObjectPropsOptions>(
  props: T
): EventPropsForwarder<T>
export function createListenerPropsForwarder<
  T extends ComponentObjectPropsOptions,
  K extends keyof T = ExtractEventPropKeys<T>
>(props: T, keys: K[]): EventPropsForwarder<T, K>
export function createListenerPropsForwarder<
  T extends ComponentObjectPropsOptions,
  K extends ExtractEventPropKeys<T>
>(props: T, keys?: K[]): EventPropsForwarder<T, K> {
  const listenerKeys = keys ?? extractListenerPropKeys(props)

  const forwardWithProps = (props: Record<string, any>) => {
    const listeners = useListenersWithProps(props)
    return listenerKeys.reduce((forwards, key) => {
      const listener = listeners.proxyIfExists(key)
      if (listener) {
        forwards[key] = listener as any
      }
      return forwards
    }, {} as ExtractPropTypes<Pick<T, K>>)
  }

  return {
    props: listenerKeys.reduce((forwardProps, k) => {
      forwardProps[k as keyof typeof forwardProps] = props[k] as any
      return forwardProps
    }, {} as Pick<T, K>),

    forwardWithProps,

    forward: (instance = getCurrentInstance()) => {
      const props = getListenerProps(instance)
      return forwardWithProps(props ?? {})
    },

    useForward: (instance = getCurrentInstance()) => {
      const props = getListenerProps(instance)
      return computed(() => forwardWithProps(props ?? {}))
    }
  }
}
