import { computed, defineComponent, DefineComponent, inject, InjectionKey, provide, Ref } from 'vue'
import { definePropType, required } from './props'

export function createInjectKey<T>(key: symbol | string): InjectionKey<T> {
  return key as InjectionKey<T>
}

interface ProviderProps<T> {
  value: T
}
export type Provider<T> = DefineComponent<ProviderProps<T>>

export interface Context<T = any> {
  key: InjectionKey<Ref<T>>
  Provider: DefineComponent<ProviderProps<T>>
  Consumer: DefineComponent
}

export function createContext<T = any>(defaultValue?: T, key?: string | symbol): Context<T> {
  const contextKey = createInjectKey<Ref<T>>(key ?? Symbol())

  const Provider = defineComponent({
    name: `${contextKey.toString()}Provider`,
    props: {
      value: required(definePropType<T>())
    },
    setup(props, { slots }) {
      provide(
        contextKey,
        computed(() => (props as ProviderProps<T>).value ?? (defaultValue as T))
      )

      return () => slots.default?.()
    }
  })

  const Consumer = defineComponent({
    name: `${contextKey.toString()}Consumer`,
    setup(props, { slots }) {
      const value = inject(contextKey)!

      return () => slots.default?.(value.value)
    }
  })

  return {
    key: contextKey,
    Provider,
    Consumer
  } as unknown as Context<T>
}
