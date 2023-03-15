import { isObject } from '@vue/shared'
import { ComputedRef, getCurrentInstance } from 'vue-module-demi'
import { useTransformState } from 'vue-reactivity-fantasy'
import { resolveVNodeElement } from '../vnode'
import { useVNode } from './useVNode'

export function useComponentElement<T extends Element = Element>(
  instance = getCurrentInstance()
): ComputedRef<T | null | undefined> {
  return useTransformState(useVNode(instance), (vnode) =>
    isObject(vnode) ? resolveVNodeElement(vnode) : null
  )
}
