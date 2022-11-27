import { ComputedRef, getCurrentInstance, onMounted, onUpdated, VNode } from 'vue-demi'
import { useMemo } from 'vue-reactivity-fantasy'

import { resolveVNode } from '../vnode'
import { useLifecycleTrack } from './use-lifecycle-track'

export function useComponentVNode<T extends VNode = VNode>(
  instance = getCurrentInstance()
): ComputedRef<T | null | undefined> {
  const trackMounted = useLifecycleTrack(onMounted, instance)
  const trackUpdated = useLifecycleTrack(onUpdated, instance)

  const vnodeRef = useMemo(() => resolveVNode<T>(instance), [trackMounted, trackUpdated])

  return vnodeRef
}
