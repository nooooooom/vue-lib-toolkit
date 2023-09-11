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

interface ContextComponents<T = any> {
  Provider: DefineComponent<ProviderProps<T>>
  Consumer: DefineComponent
}

export interface RegularContext<T = any> extends ContextComponents<T> {
  key: InjectionKey<T>
  use: () => T | undefined
  provide: (value: T) => void
}

export interface SyncContext<T = any> extends ContextComponents<T> {
  key: InjectionKey<Ref<T>>
  use: () => Ref<T> | undefined
  provide: (value: Ref<T>) => void
}

export type Context<T = any, Sync extends boolean = false> = Sync extends true
  ? SyncContext<T>
  : RegularContext<T>

export function createContext<T = any>(
  defaultValue?: T,
  injectionKey?: string | symbol,
  sync?: false
): Context<T, false>
export function createContext<T = any>(
  defaultValue: T,
  injectionKey: string | symbol | undefined,
  sync: true
): Context<T, true>
export function createContext<T = any, Sync extends boolean = false>(
  defaultValue?: T,
  injectionKey?: string | symbol,
  sync?: Sync
): Context<T, Sync> {
  type ContextValue = Sync extends true ? Ref<T> : T

  const key = createInjectionKey<ContextValue>(injectionKey ?? Symbol())
  const keyName = typeof key === 'symbol' ? key.description : key

  const use = (_defaultValue?: ContextValue) =>
    inject(
      key,
      _defaultValue ?? ((sync ? computed(() => defaultValue) : defaultValue) as ContextValue)
    )

  const provide = (value: ContextValue) => coreProvide(key, value)

  const Provider = defineComponent({
    name: `${keyName}Provider`,
    props: {
      value: required(definePropType<T>())
    },
    setup(props, { slots }) {
      provide(
        (sync
          ? computed(() => (props as ProviderProps<T>).value ?? (defaultValue as T))
          : (props as ProviderProps<T>).value) as ContextValue
      )

      return () => slots.default?.()
    }
  })

  const Consumer = defineComponent({
    name: `${keyName}Consumer`,
    setup(props, { slots }) {
      const value = use()!

      return () => slots.default?.(sync ? (value as any as Ref<T>).value : value)
    }
  })

  return {
    key,
    use,
    provide,
    Provider,
    Consumer
  } as any as Context<T, Sync>
}
