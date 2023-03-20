import { camelize } from '@vue/shared'
import { computed, getCurrentInstance, shallowReactive, watchEffect } from 'vue'
import { isVue2 } from 'vue-module-demi'

// Handle the situation that vue can only receive `props` by passing `options.props`
export function useProps<T>(currentInstance = getCurrentInstance()): T {
  const props = shallowReactive({})

  const attrs = computed(() => {
    const attrs = currentInstance!.proxy?.$attrs
    if (!attrs) {
      return {}
    }
    // make a backup copy of attrs in props format
    const asProps = {} as Record<string, any>
    for (const attr of Object.keys(attrs)) {
      asProps[camelize(attr)] = asProps[attr] = attrs[attr]
    }
    return asProps
  })

  watchEffect(
    () => {
      Object.assign(
        props,
        attrs.value,
        isVue2 ? (currentInstance!.proxy as any)?._props : currentInstance?.props
      )
    },
    {
      flush: 'pre'
    }
  )

  return props as T
}
