import { isObject, isPlainObject, isString } from '@vue/shared'
import { Comment, Fragment, Text } from 'vue-module-demi'
import type { VNode } from 'vue'
import { isVNode as leading_isVNode } from 'vue'
import { isVue3, isVue2 } from '../utils/version'
import { resolveVNodeType } from './props'

export const enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}

export const isVNode = isVue2
  ? (vnode: unknown): vnode is VNode => isPlainObject(vnode)
  : leading_isVNode

export function isElement(vnode: VNode) {
  return isVue2 ? legacy_isElement(vnode) : !!(vnode.shapeFlag & ShapeFlags.ELEMENT)
}

export function isComponent(vnode: VNode) {
  return isVue2 ? legacy_isComponent(vnode) : !!(vnode.shapeFlag & ShapeFlags.COMPONENT)
}

export function isComment(vnode: VNode) {
  return isVue2 ? legacy_isComment(vnode) : resolveVNodeType(vnode) === Comment
}

export function isFragment(vnode: VNode) {
  return isVue3 && resolveVNodeType(vnode) === Fragment
}

export function isText(vnode: VNode) {
  return isVue3 ? resolveVNodeType(vnode) === Text : legacy_isText(vnode)
}

// ----------------------------------------------------------------------------
// Legacy
// ----------------------------------------------------------------------------

function legacy_isElement(vnode: any): boolean {
  return isVNode(vnode) && (vnode as any).tag != null && !legacy_isComponent(vnode)
}

function legacy_isComponent(vnode: any): boolean {
  return isVNode(vnode) && ((vnode as any).componentOptions || !legacy_isAsyncPlaceholder(vnode))
}

function legacy_isComment(vnode: unknown): boolean {
  return isVNode(vnode) && (vnode as any).isComment
}

function legacy_isText(vnode: any): boolean {
  return isString(vnode) || (isObject(vnode) && !vnode.tag && !legacy_isComment(vnode))
}

function legacy_isAsyncPlaceholder(vnode: any): boolean {
  return isObject(vnode) && vnode.isComment && vnode.asyncFactory
}
