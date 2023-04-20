import {
  computed,
  defineComponent,
  DefineComponent,
  inject,
  InjectionKey,
  provide as coreProvide,
  Ref
} from 'vue-module-demi'
import { definePropType, required } from './props'

export function createInjectionKey<T>(key: symbol | string): InjectionKey<T> {
  return key as InjectionKey<T>
}

interface ProviderProps<T> {
  value: T
}
export type Provider<T> = DefineComponent<ProviderProps<T>>

export interface Context<T = any> {
  key: InjectionKey<Ref<T>>
  use: () => Ref<T> | undefined
  provide: (value: Ref<T>) => void
  Provider: DefineComponent<ProviderProps<T>>
  Consumer: DefineComponent
}

export function createContext<T = any>(
  defaultValue?: T,
  injectionKey?: string | symbol
): Context<T> {
  const key = createInjectionKey<Ref<T>>(injectionKey ?? Symbol())
  const use = (_defaultValue?: Ref<T>) => inject(key, _defaultValue ?? computed(() => defaultValue))
  const provide = (value: Ref<T>) => coreProvide(key, value)

  const Provider = defineComponent({
    name: `${key.toString()}Provider`,
    props: {
      value: required(definePropType<T>())
    },
    setup(props, { slots }) {
      provide(computed(() => (props as ProviderProps<T>).value ?? (defaultValue as T)))
      return () => slots.default?.()
    }
  })

  const Consumer = defineComponent({
    name: `${key.toString()}Consumer`,
    setup(props, { slots }) {
      const value = use()!
      return () => slots.default?.(value.value)
    }
  })

  return {
    key,
    use,
    provide,
    Provider,
    Consumer
  } as unknown as Context<T>
}
