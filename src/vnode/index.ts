import type { VNode } from 'vue-module-demi'
import { isVue2 } from '../version'
import type { ComponentInternalInstance } from '../types'
import { getCurrentInstance } from '../composables/utils'

export * from './children'
export * from './props'
export * from './types'

export function resolveVNode<T extends VNode = VNode>(
  instance: ComponentInternalInstance | null = getCurrentInstance()
): T | null | undefined {
  return isVue2 ? (instance as any)?.$vnode : instance?.vnode
}
