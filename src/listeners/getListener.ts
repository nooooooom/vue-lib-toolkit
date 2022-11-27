import { camelize, hyphenate, isArray } from '@vue/shared'
import { getCurrentInstance, isVue3 } from 'vue-demi'

import { toHandlerKey, toListenerKey } from './transform'
import { convertLegacyEventKey } from '../legacy'
import { invokeCallbacks } from '../utils'

export function getListenerProps(instance = getCurrentInstance()): Record<string, any> | null {
  if (!instance) {
    return null
  }
  return isVue3 ? instance.proxy?.$props : (instance.proxy as any).$listeners
}

export function getListener(props: Record<string, any> | null, event: string) {
  if (!props) {
    return
  }
  event = isVue3 ? toListenerKey(event) : toHandlerKey(event)
  const listener = props[event] || props[camelize(event)] || props[hyphenate(event)]
  if (isArray(listener)) {
    return listener.length ? (...args: any[]) => invokeCallbacks(listener, ...args) : undefined
  }
  return listener
}

export function getListenerWithModifier(props: Record<string, any> | null, event: string) {
  if (!props) {
    return
  }
  event = isVue3 ? toListenerKey(event) : convertLegacyEventKey(event)
  return (
    props[`${event}Passive`] ||
    props[`${event}Once`] ||
    props[`${event}Capture`] ||
    props[`${event}PassiveOnce`] ||
    props[`${event}PassiveCapture`] ||
    props[`${event}OnceCapture`] ||
    props[`${event}PassiveOnceCapture`]
  )
}

export function hasListener(props: Record<string, any> | null, event: string) {
  return !!getListener(props, event)
}

export function hasListenerWithModifier(props: Record<string, any> | null, event: string) {
  return !!getListenerWithModifier(props, event)
}
