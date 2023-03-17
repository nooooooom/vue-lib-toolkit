import { computed, getCurrentInstance, VNode } from 'vue-module-demi'
import { findChild, VNodeChildAtom } from '../vnode'
import { useVNode } from './use-vnode'

export function useFirstQualifiedVNode<T extends VNode = VNode>(
  qualifier: (vnode: VNodeChildAtom) => boolean,
  instance = getCurrentInstance()
) {
  const vnodeRef = useVNode(instance)

  return computed<T | null | undefined>(() =>
    findChild(vnodeRef.value, (child) => qualifier(child))
  )
}
