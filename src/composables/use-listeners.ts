import { getCurrentInstance } from 'vue-demi'

import { invoke } from '../utils'
import { getListener, getListenerProps, hasListener } from '../listeners'
import type { AnyHandler } from '../types'

export interface ListenersContext {
  emit: <T extends AnyHandler = AnyHandler>(event: string, ...args: Parameters<T>) => void
  has: (event: string) => void
  proxy: <T extends AnyHandler = AnyHandler>(event: string) => T
  proxyIfExists: <T extends AnyHandler = AnyHandler>(event: string) => T | undefined
}

export function useListenersWithProps(props: Record<string, any>): ListenersContext {
  return {
    emit: (event, ...args) => {
      invoke(getListener(props, event), ...args)
    },
    has: (event) => hasListener(props, event),
    proxy: (event) => <any>((...args: any[]) => {
        invoke(getListener(props, event), ...args)
      }),
    proxyIfExists: (event) => {
      const handler = getListener(props, event)
      return handler && <any>((...args: any[]) => {
          handler(...args)
        })
    }
  }
}

export function useListeners(instance = getCurrentInstance()): ListenersContext {
  const props = getListenerProps(instance)
  return useListenersWithProps(props || {})
}
