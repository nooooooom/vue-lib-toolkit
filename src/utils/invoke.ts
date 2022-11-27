import { isFunction } from '@vue/shared'

export function invoke<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T>
export function invoke(fn: any, ...args: any[]) {
  return isFunction(fn) ? fn(...args) : undefined
}

export function invokeCallbacks<T extends (...args: any[]) => any>(
  callbacks: T[],
  ...args: Parameters<T>[]
): void
export function invokeCallbacks(callbacks: any[], ...args: any[]) {
  callbacks.forEach((cb) => invoke(cb, ...args))
}
