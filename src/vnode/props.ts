import { isArray, isFunction, isObject, normalizeClass, normalizeStyle } from '@vue/shared'

import { isHandlerKey } from '../listeners'

export function mergedClass(...classes: unknown[]) {
  return normalizeClass(classes)
}

export function mergedStyle(...styles: unknown[]) {
  return normalizeStyle(styles)
}

export function mergeListener(...listeners: unknown[]) {
  return listeners.reduce<Function[]>((merged, listener) => {
    if (isArray(listener) || (isFunction(listener) && !merged.includes(listener))) {
      return merged.concat(listener).flat()
    }
    return merged
  }, [])
}

export function mergeListeners(...listeners: unknown[]) {
  const ret: Record<string, Function[]> = {}
  for (let i = 0; i < listeners.length; i++) {
    const toMerge = listeners[i]
    if (isObject(toMerge)) {
      for (let key in toMerge) {
        const existing = ret[key]
        const incoming = (toMerge as any)[key]
        if (incoming && existing !== incoming) {
          ret[key] = mergeListener(existing, incoming)
        }
      }
    }
  }
  return ret
}

export function mergeProps(...props: Array<Record<string, unknown> | undefined | null>) {
  const ret: Record<string, any> = {}
  for (let i = 0; i < props.length; i++) {
    const toMerge = props[i]
    for (const key in toMerge) {
      if (key === 'class') {
        if (ret.class !== toMerge.class) {
          ret.class = mergedClass(ret.class, toMerge.class)
        }
      } else if (key === 'style') {
        ret.style = mergedStyle(ret.style, toMerge.style)
      } else if (isHandlerKey(key)) {
        ret[key] = mergeListener(ret[key], toMerge[key])
      } else if (key !== '') {
        ret[key] = toMerge[key]
      }
    }
  }
  return ret
}
