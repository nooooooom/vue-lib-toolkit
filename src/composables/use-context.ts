import { computed, defineComponent, inject, provide } from 'vue-demi'
import type { ComputedRef, DefineComponent, Ref } from 'vue-demi'

import { definePropType, required } from '../props'
import { createInjectKey } from '../inject'

export interface UseContextValue<T> {
  (): ComputedRef<T | undefined>
  (defaultValue: T, treatDefaultAsFactory?: false): ComputedRef<T>
  (defaultValue: T | (() => T), treatDefaultAsFactory: true): ComputedRef<T>
}

interface ProviderProps<T> {
  value: T
}

export interface Context<T = any> {
  Provider: DefineComponent<ProviderProps<T>>
  Consumer: DefineComponent
  useContextValue: UseContextValue<T>
  useContextProvider: (value: T) => void
}

export interface UseContext {
  <T>(context: Context<T>): ComputedRef<T | undefined>
  <T>(context: Context<T>, defaultValue: T, treatDefaultAsFactory?: false): ComputedRef<T>
  <T>(context: Context<T>, defaultValue: T | (() => T), treatDefaultAsFactory: true): ComputedRef<T>
}

export const useContext: UseContext = (context) => context.useContextValue()

export function createContext<T = any>(defaultValue?: T, customKey?: string | symbol): Context<T> {
  const contextKey = createInjectKey<Ref<T>>(customKey ?? Symbol())

  const useContextValue = <Context<T>['useContextValue']>inject.bind(null, contextKey)

  const useContextProvider = <Context<T>['useContextProvider']>((newValue) => {
    provide(contextKey, computed(() => newValue ?? defaultValue) as ComputedRef<T>)
  })

  const Provider = defineComponent({
    name: 'Provider',
    props: {
      value: required(definePropType<T>())
    },
    setup(props, { slots }) {
      useContextProvider((props as ProviderProps<T>).value)
      return () => slots.default?.()
    }
  })

  const Consumer = defineComponent({
    name: 'Consumer',
    setup(_, { slots }) {
      const valueRef = useContextValue()
      return () => slots.default?.(valueRef.value)
    }
  })

  return {
    Provider,
    Consumer,
    useContextValue,
    useContextProvider
  } as unknown as Context<T>
}
