import { isObject } from '@vue/shared'
import { ComputedRef, getCurrentInstance } from 'vue'
import { useTransformState } from 'vue-reactivity-fantasy'
import { getVNodeElement } from '../compat'
import { useVNode } from './useVNode'

export function useComponentElement<T extends Element = Element>(
  instance = getCurrentInstance()
): ComputedRef<T | null | undefined> {
  return useTransformState(useVNode(instance), (vnode) =>
    isObject(vnode) ? getVNodeElement(vnode) : null
  )
}
