import { isArray } from '@vue/shared'

import type { MaybeArray } from '../types'
import { isNonNullable } from './is'

export function toArray<T>(value?: MaybeArray<T>): Array<T> {
  return !isNonNullable(value) ? [] : isArray(value) ? value : ([value] as Array<T>)
}
