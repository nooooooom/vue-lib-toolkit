import type { getCurrentInstance } from 'vue-demi'

export type MaybeArray<T> = T | ReadonlyArray<T>

export type AnyHandler = (...args: any[]) => any

export type ComponentInternalInstance = ReturnType<typeof getCurrentInstance>
