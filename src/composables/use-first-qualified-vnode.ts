import { computed, getCurrentInstance, VNode } from 'vue'
import { findChild, VNodeChildAtom } from '../vnode'
import { useVNode } from './useVNode'

export function useFirstQualifiedVNode<T extends VNode = VNode>(
  instance = getCurrentInstance(),
  qualifier: (vnode: VNodeChildAtom) => boolean
) {
  const vnodeRef = useVNode(instance)

  return computed<T | null | undefined>(() =>
    findChild(vnodeRef.value, (child) => qualifier(child))
  )
}
