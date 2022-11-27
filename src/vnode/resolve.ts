import { isVue3, VNode } from 'vue-demi'

import type { ComponentInternalInstance } from '../types'

export function resolveVNode<T extends VNode = VNode>(
  instance: ComponentInternalInstance
): T | null | undefined {
  return isVue3 ? instance?.vnode : (instance?.proxy as any)?.$vnode
}

export function resolveVNodeElement<T extends Element>(vnode: VNode): T | null | undefined {
  return isVue3 ? vnode.el : (vnode as any).elm
}

export function resolveVNodeType<T = any>(vnode: VNode): T {
  return isVue3 ? vnode.type : (vnode as any).tag
}
