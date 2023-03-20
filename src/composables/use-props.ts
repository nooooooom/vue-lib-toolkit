import { camelize } from '@vue/shared'
import { computed, getCurrentInstance, shallowReactive, watchEffect } from 'vue'
import { isVue2 } from 'vue-module-demi'

// Handle the situation that vue can only receive `props` by passing `options.props`
export function useProps<T>(currentInstance = getCurrentInstance()): T {
  const props = shallowReactive({})

  const updateProps = computed(() => {
    const attrs = {} as Record<string, any>
    const $attrs = currentInstance!.proxy?.$attrs
    if ($attrs) {
      for (const attr in $attrs) {
        // make a backup copy of attrs in props format
        attrs[camelize(attr)] = attrs[attr] = $attrs[attr]
      }
    }

    return {
      ...attrs,
      ...(isVue2 ? (currentInstance!.proxy as any)?._props : currentInstance?.props)
    }
  })

  if (isVue2) {
    const set = (currentInstance?.proxy as any).$set
    watchEffect(
      () => {
        const updatePropsValue = updateProps.value
        for (const prop in updatePropsValue) {
          set(props, prop, updatePropsValue[prop])
        }
      },
      {
        flush: 'pre'
      }
    )
  } else {
    watchEffect(
      () => {
        Object.assign(props, updateProps.value)
      },
      {
        flush: 'pre'
      }
    )
  }

  return props as T
}
