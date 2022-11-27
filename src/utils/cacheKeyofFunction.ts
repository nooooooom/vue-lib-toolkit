export type PropertyName = string | number | symbol

export function cacheKeyofFunction<T extends PropertyName, U = any>(
  fn: (key: T) => U,
  ignoreNullable = false
): (key: T) => U {
  const cache: Record<T, U> = Object.create(null)
  return (key: T) => {
    const hit = cache[key]
    if (ignoreNullable && key in cache) {
      return hit
    }
    return hit || (cache[key] = fn(key))
  }
}
