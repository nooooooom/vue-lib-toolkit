import { isEventKey, toListenerKey } from '../vnode'
import { isVue2 } from '../version'
import { shallowRef } from 'vue'
import { useEffect } from 'vue-reactivity-fantasy'

export interface UseCompatPropsCtx {
  emit: (event: string, ...args: any[]) => void
}

// compat Vue2 can't extract event callback function from props
export function useLeadingProps<T extends Record<string, any>>(
  rawProps: T,
  ctx: UseCompatPropsCtx
) {
  if (isVue2) {
    const eventKeys = Object.keys(rawProps).filter(isEventKey)
    const eventProps = eventKeys.reduce((props, event) => {
      props[event] = (...args: any) => ctx.emit(toListenerKey(event), ...args)
      return props
    }, {} as Record<string, UseCompatPropsCtx['emit']>)

    if (!eventProps.length) {
      return rawProps
    }

    const compatProps = shallowRef({
      ...rawProps,
      ...eventProps
    })

    useEffect(() => {
      Object.assign(compatProps, rawProps, eventProps)
    })

    return compatProps
  }

  return rawProps
}
