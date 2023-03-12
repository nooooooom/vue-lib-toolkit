import type { VNode } from 'vue'
import { isVue2 } from '../utils/version'
import type { ComponentInternalInstance } from '../types'

export * from './children'
export * from './props'
export * from './types'

export function resolveVNode<T extends VNode = VNode>(
  instance: ComponentInternalInstance | null
): T | null | undefined {
  return isVue2 ? (instance?.proxy as any)?.$vnode : instance?.vnode
}
