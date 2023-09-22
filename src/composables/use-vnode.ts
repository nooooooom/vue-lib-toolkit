import { ComputedRef, onMounted, onUpdated, ref, VNode } from 'vue-module-demi'
import { useComputed, useEffect } from 'vue-reactivity-fantasy'
import { resolveVNode } from '../vnode'
import { useLifecycleTrack } from './use-lifecycle-track'
import { getCurrentInstance } from './utils'

export function useVNode<T extends VNode = VNode>(
  instance = getCurrentInstance()
): ComputedRef<T | null | undefined> {
  const trackMounted = useLifecycleTrack(onMounted, instance)
  const trackUpdated = useLifecycleTrack(onUpdated, instance)

  const vnode = ref<T | null | undefined>()

  useEffect(() => {
    vnode.value = resolveVNode<T>(instance)
  }, [trackMounted, trackUpdated])

  return useComputed(vnode)
}
