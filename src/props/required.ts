import { isPlainObject } from '@vue/shared'
import type { PropType } from 'vue-demi'

interface PropOptions {
  type?: PropType<any> | true | null
  required?: boolean
  default?: any
}

export type Required<T> = T extends PropType<any>
  ? {
      type: T
      required: true
    }
  : T extends PropOptions
  ? Omit<T, 'required'> & {
      required: true
    }
  : never

export function required<T extends PropType<any> | PropOptions>(options?: T): Required<T> {
  return (
    isPlainObject(options)
      ? {
          ...options,
          required: true
        }
      : {
          type: options,
          required: true
        }
  ) as Required<T>
}
