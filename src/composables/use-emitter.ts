import { getCurrentInstance } from 'vue-demi'

import { getListener, getListenerProps } from '../listeners'
import type { AnyHandler } from '../types'

export type Emitter<T extends AnyHandler = AnyHandler> = (
  event: string,
  ...args: Parameters<T>
) => void

export function useEmitter(instance = getCurrentInstance()): Emitter {
  const props = getListenerProps(instance)

  return (event: string, ...args: any[]) => {
    getListener(props, event)?.(...args)
  }
}
