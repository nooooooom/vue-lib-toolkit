import {
  capitalize,
  isArray,
  isFunction,
  isObject,
  isOn,
  normalizeClass,
  normalizeStyle
} from '@vue/shared'
import type { Ref, VNode } from 'vue'
import { cloneVNode as leading_cloneVNode } from 'vue'
import { isVue2 } from '../version'
import { isVNode } from './types'

export const cloneVNode = isVue2 ? legacy_cloneVNode : leading_cloneVNode

export function resolveVNodeType<T = any>(vnode: VNode): T {
  return isVue2 ? (vnode as any).tag : vnode.type
}

export function resolveVNodeElement<T extends Element>(vnode: VNode): T | null | undefined {
  return isVue2 ? (vnode as any).elm : vnode.el
}

export const isEventKey = isOn

// event -> onEvent
export function toEventKey(event: string) {
  if (!event) {
    return ''
  }

  return !isEventKey(event) ? `on${capitalize(event)}` : event
}

// onEvent -> event
export function toListenerKey(event: string) {
  if (isEventKey(event)) {
    event = event.replace(/^on-?/, '')
    return event.charAt(0).toLowerCase() + event.slice(1)
  }

  return event
}

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
      if (key === 'class' || (isVue2 && key === 'staticClass')) {
        if (ret[key] !== toMerge[key]) {
          ret[key] = mergedClass(ret[key], toMerge[key])
        }
      } else if (key === 'style' || (isVue2 && key === 'staticStyle')) {
        ret[key] = mergedStyle(ret.style, toMerge.style)
      } else if (isEventKey(key)) {
        ret[key] = mergeListener(ret[key], toMerge[key])
      } else if (key !== '') {
        if (isVue2) {
          if (key === 'props' || key === 'attrs' || key === 'domProps') {
            ret[key] = {
              ...ret[key],
              ...(toMerge[key] as any)
            }
            continue
          } else if (key === 'on') {
            ret[key] = mergeListeners(ret[key], toMerge[key])
          }
        }
        ret[key] = toMerge[key]
      }
    }
  }
  return ret
}

/**
 * @internal
 */
export interface LegacyVNodeData {
  key?: string | number
  slot?: string
  ref?: string | Ref | ((el: any) => void)
  is?: string
  pre?: boolean
  tag?: string
  staticClass?: string
  class?: any
  staticStyle?: { [key: string]: any }
  style?: string | Array<Object> | Object
  normalizedStyle?: Object
  props?: { [key: string]: any }
  attrs?: { [key: string]: string }
  domProps?: { [key: string]: any }
  hook?: { [key: string]: Function }
  on?: { [key: string]: Function | Array<Function> }
  nativeOn?: { [key: string]: Function | Array<Function> }
  transition?: Object
  show?: boolean // marker for v-show
  inlineTemplate?: {
    render: Function
    staticRenderFns: Array<Function>
  }
  directives?: Array<LegacyVNodeDirective>
  keepAlive?: boolean
  scopedSlots?: { [key: string]: Function }
  model?: {
    value: any
    callback: Function
  }

  [key: string]: any
}

/**
 * @internal
 */
export type LegacyVNodeDirective = {
  name: string
  rawName: string
  value?: any
  oldValue?: any
  arg?: string
  oldArg?: string
  modifiers?: { [key: string]: boolean }
  def?: Object
}

function legacy_cloneVNode(_vnode: VNode, extraProps?: LegacyVNodeData | null, mergeRef = false) {
  if (!isVNode(_vnode)) {
    return
  }

  const vnode = _vnode as any

  if (mergeRef && vnode.data) {
    // TODO: support when needed
  }

  const mergedProps = extraProps ? mergeProps(vnode.data || {}, extraProps) : vnode.data
  const cloned = new vnode.constructor(
    vnode.tag,
    mergedProps,
    vnode.children && vnode.children.slice(),
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.key = cloned.key ?? vnode.key
  cloned.isStatic = vnode.isStatic
  cloned.isComment = vnode.isComment
  cloned.isCloned = true

  return cloned
}
