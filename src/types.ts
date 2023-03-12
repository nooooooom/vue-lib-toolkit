import type { getCurrentInstance, Ref } from 'vue'

export type ComponentInternalInstance = NonNullable<ReturnType<typeof getCurrentInstance>>

export type MaybeRef<T> = T | Ref<T>

export type MaybeArray<T> = T | ReadonlyArray<T>

export type AnyHandler = (...args: any[]) => any
