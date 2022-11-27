import { isObject } from '@vue/shared'
import { ComputedRef, getCurrentInstance } from 'vue-demi'
import { useTransformState } from 'vue-reactivity-fantasy'

import { resolveVNodeElement } from '../vnode'
import { useComponentVNode } from './use-component-vnode'

export function useComponentElement<T extends Element = Element>(
  instance = getCurrentInstance()
): ComputedRef<T | null | undefined> {
  return useTransformState(useComponentVNode(instance), (vnode) =>
    isObject(vnode) ? resolveVNodeElement(vnode) : null
  )
}
