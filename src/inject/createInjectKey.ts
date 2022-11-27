import type { InjectionKey } from 'vue-demi'

export function createInjectKey<T>(key: symbol | string): InjectionKey<T> {
  return key as InjectionKey<T>
}
