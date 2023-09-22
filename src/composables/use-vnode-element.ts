import { isObject } from '@vue/shared'
import type { ComputedRef } from 'vue-module-demi'
import { useTransformState } from 'vue-reactivity-fantasy'
import { resolveVNodeElement } from '../vnode'
import { useVNode } from './use-vnode'
import { getCurrentInstance } from './utils'

export function useComponentElement<T extends Element = Element>(
  instance = getCurrentInstance()
): ComputedRef<T | null | undefined> {
  return useTransformState(useVNode(instance), (vnode) =>
    isObject(vnode) ? resolveVNodeElement(vnode) : null
  )
}
