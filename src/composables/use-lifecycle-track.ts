import { getCurrentInstance } from 'vue'
import { useForceUpdate } from 'vue-reactivity-fantasy'

import type { ComponentInternalInstance } from '../types'

export type LifecycleHook = (hook: () => any, target?: ComponentInternalInstance | null) => void

export function useLifecycleTrack(hook: LifecycleHook, currentInstance = getCurrentInstance()) {
  const [track, trigger] = useForceUpdate()

  hook(trigger, currentInstance)

  return track as () => number
}
