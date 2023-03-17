import { camelize } from '@vue/shared'
import { computed, getCurrentInstance, shallowReactive, watchEffect } from 'vue'
import { isVue2 } from 'vue-module-demi'

// Handle the situation that vue can only receive `props` by passing `options.props`
export function useProps<T>(currentInstance = getCurrentInstance()) {
  const props = shallowReactive({}) as T

  if (isVue2) {
    const attrs = computed(() => {
      const attrs = currentInstance!.proxy!.$attrs
      if (!attrs) {
        return {}
      }
      const asProps = { ...attrs } as Record<string, any>
      for (const attr of Object.keys(attrs)) {
        asProps[camelize(attr)] = attrs[attr]
      }
      return asProps
    })
    watchEffect(
      () => Object.assign(props as any, attrs.value, (currentInstance!.proxy as any)?._props),
      {
        flush: 'pre'
      }
    )
  } else {
    watchEffect(() => Object.assign(props as any, currentInstance!.props), {
      flush: 'pre'
    })
  }

  return props
}
