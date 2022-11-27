import { computed, getCurrentInstance, VNode } from 'vue-demi'

import { findChild, VNodeChildAtom } from '../vnode'
import { useComponentVNode } from './use-component-vnode'

export function useFirstQualifiedVNode<T extends VNode = VNode>(
  instance = getCurrentInstance(),
  qualifier: (vnode: VNodeChildAtom) => boolean
) {
  const vnodeRef = useComponentVNode(instance)
  return computed<T | null | undefined>(() =>
    findChild(vnodeRef.value, (child) => qualifier(child))
  )
}
