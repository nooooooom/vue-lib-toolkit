import * as Vue from 'vue'
import { isVue3, VNode } from 'vue-demi'

import { ShapeFlags } from './shapeFlags'
import { legacyIsComment, legacyIsComponent, legacyIsElement, legacyIsText } from '../legacy'
import { resolveVNodeType } from './resolve'

export function isElement(vnode: VNode) {
  return isVue3 ? !!(vnode.shapeFlag & ShapeFlags.ELEMENT) : legacyIsElement(vnode)
}

export function isComponent(vnode: VNode) {
  return isVue3 ? !!(vnode.shapeFlag & ShapeFlags.COMPONENT) : legacyIsComponent(vnode)
}

export function isComment(vnode: VNode) {
  return isVue3 ? resolveVNodeType(vnode) === Vue.Comment : legacyIsComment(vnode)
}

export function isFragment(vnode: VNode) {
  return isVue3 && resolveVNodeType(vnode) === Vue.Fragment
}

export function isText(vnode: VNode) {
  return isVue3 ? resolveVNodeType(vnode) === Vue.Text : legacyIsText(vnode)
}
