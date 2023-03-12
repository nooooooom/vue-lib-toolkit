import { computed, getCurrentInstance } from 'vue'
import { findChild, isVNode, resolveVNodeElement } from '../vnode'
import { useVNode } from './useVNode'

export function useFirstQualifiedElement<T extends Element = Element>(
  instance = getCurrentInstance(),
  qualifier: (node: Element) => boolean
) {
  const vnode = useVNode(instance)

  return computed(() => {
    let element: T | null | undefined
    findChild(vnode.value, (child) => {
      const resolved = isVNode(child) && resolveVNodeElement<T>(child)
      if (resolved && qualifier(resolved)) {
        element = resolved
        return true
      }
      return false
    })
    return element
  })
}
