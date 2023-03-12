import { ComputedRef, getCurrentInstance, onMounted, onUpdated, VNode } from 'vue'
import { useMemo } from 'vue-reactivity-fantasy'
import { getVNode } from '../compat'
import { useLifecycleTrack } from './use-lifecycle-track'

export function useVNode<T extends VNode = VNode>(
  instance = getCurrentInstance()
): ComputedRef<T | null | undefined> {
  const trackMounted = useLifecycleTrack(onMounted, instance)
  const trackUpdated = useLifecycleTrack(onUpdated, instance)

  const vnode = useMemo(() => getVNode<T>(instance), [trackMounted, trackUpdated])

  return vnode
}
