import { isObject } from '@vue/shared'
import { computed, getCurrentInstance } from 'vue-demi'

import { findChild, resolveVNodeElement } from '../vnode'
import { useComponentVNode } from './use-component-vnode'

export function useFirstQualifiedElement<T extends Element = Element>(
  instance = getCurrentInstance(),
  qualifier: (vnode: Element) => boolean
) {
  const vnodeRef = useComponentVNode(instance)
  return computed(() => {
    let element: T | null | undefined
    findChild(vnodeRef.value, (child) => {
      const resolved = isObject(child) && resolveVNodeElement<T>(child)
      if (resolved && qualifier(resolved)) {
        element = resolved
        return true
      }
      return false
    })
    return element
  })
}
