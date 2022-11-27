import { isObject, isString } from '@vue/shared'

import { isNonNullable } from '../utils'

export function legacyIsElement(vnode: any): boolean {
  return isObject(vnode) && isNonNullable(vnode.tag) && !legacyIsComponent(vnode)
}

export function legacyIsComponent(vnode: any): boolean {
  return isObject(vnode) && (vnode.componentOptions || !legacyIsAsyncPlaceholder(vnode))
}

export function legacyIsComment(vnode: any): boolean {
  return isObject(vnode) && vnode.isComment
}

export function legacyIsText(vnode: any): boolean {
  return isString(vnode) || (isObject(vnode) && !vnode.tag && !legacyIsComment(vnode))
}

export function legacyIsAsyncPlaceholder(vnode: any): boolean {
  return isObject(vnode) && vnode.isComment && vnode.asyncFactory
}
