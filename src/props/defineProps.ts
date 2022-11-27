import type { PropType } from 'vue-demi'

export const definePropType = <T>(
  type?: ResolvePropConstructor<T> | any[] | true | null
): PropType<T> => type as PropType<T>

export type ResolvePropConstructor<T> = T extends string
  ? StringConstructor
  : T extends number
  ? NumberConstructor
  : T extends symbol
  ? SymbolConstructor
  : T extends bigint
  ? BigIntConstructor
  : T extends Function
  ? FunctionConstructor
  : T extends any[]
  ? ArrayConstructor
  : T extends null
  ? null
  : T extends object
  ? ObjectConstructor
  : any
