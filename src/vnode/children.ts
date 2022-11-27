import { isVue3, VNode } from 'vue-demi'
import { isArray, isObject } from '@vue/shared'

import { toArray } from '../utils'
import type { MaybeArray } from '../types'
import { ShapeFlags } from './shapeFlags'

export type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void

export function hasArrayChildren(vnode: VNode) {
  return isVue3 ? !!(vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) : isArray(vnode.children)
}

export function forEachChildren(
  vnode: MaybeArray<VNodeChildAtom>,
  callbackfn: (child: VNodeChildAtom, breakEach: () => void) => void
) {
  if (!vnode) {
    return
  }

  let isBreaked = false
  const breakEach = () => (isBreaked = true)

  const each = (children: Array<VNodeChildAtom>) => {
    for (const child of children) {
      if (!isObject(child)) {
        callbackfn(child, breakEach)
        if (isBreaked) {
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
      if (isBreaked) {
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
