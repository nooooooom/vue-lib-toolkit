import { getCurrentInstance } from 'vue-demi'
import { useForceUpdate } from 'vue-reactivity-fantasy'

import type { ComponentInternalInstance } from '../types'

export type LifecycleHook = (hook: () => any, target?: ComponentInternalInstance) => void

export function useLifecycleTrack(hook: LifecycleHook, target = getCurrentInstance()) {
  const [track, trigger] = useForceUpdate()

  hook(trigger, target)

  return track as () => number
}
