import type { VNode } from 'vue'
import { isArray, isObject } from '@vue/shared'
import { isVue2, isVue3 } from '../version'
import type { MaybeArray } from '../types'
import { ShapeFlags } from './types'

export type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void

function toArray<T>(value?: MaybeArray<T>): Array<T> {
  return value != null ? (isArray(value) ? value : ([value] as Array<T>)) : []
}

export function hasArrayChildren(vnode: VNode) {
  return isVue2 ? isArray(vnode.children) : !!(vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN)
}

export function forEachChildren(
  vnode: MaybeArray<VNodeChildAtom>,
  callbackfn: (child: VNodeChildAtom, breakEach: () => void) => void
) {
  if (!vnode) {
    return
  }

  let isBreak = false
  const breakEach = () => (isBreak = true)

  const each = (children: Array<VNodeChildAtom>) => {
    for (const child of children) {
      if (!isObject(child)) {
        callbackfn(child, breakEach)
        if (isBreak) {
          return
        }
        continue
      }

      if (isVue3) {
        if (child.component?.subTree) {
          each([child.component.subTree])
          continue
        }
      }

      callbackfn(child, breakEach)
      if (isBreak) {
        return
      }

      each(toArray(child.children) as Array<VNodeChildAtom>)
    }
  }

  each(toArray(vnode))
}

export function findChild<T extends VNodeChildAtom>(
  vnode: MaybeArray<VNode | undefined | null>,
  predicate: (child: VNodeChildAtom) => child is T
): T | null
export function findChild<T extends VNodeChildAtom>(
  vnode: MaybeArray<VNode | undefined | null>,
  predicate: (child: VNodeChildAtom) => boolean
): T | null
export function findChild<T extends VNodeChildAtom = VNodeChildAtom>(
  vnode: MaybeArray<VNode | undefined | null>,
  predicate: (child: VNodeChildAtom) => boolean
): T | null {
  let ret: T | null = null

  forEachChildren(vnode, (child, breakEach) => {
    if (predicate(child)) {
      ret = child as T
      breakEach()
    }
  })

  return ret
}
