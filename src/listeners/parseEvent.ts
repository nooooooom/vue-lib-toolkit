import { hyphenate } from '@vue/shared'

import { convertLegacyEventKey } from '../legacy'
import { toListenerKey } from './transform'

const optionsModifierRE = /(?:Once|Passive|Capture)$/

export interface ParsedEvent {
  type: string
  options: EventListenerOptions | undefined
}

export function parseEvent(name: string): ParsedEvent {
  // for Vue2
  name = convertLegacyEventKey(toListenerKey(name))

  let options: EventListenerOptions | undefined
  if (optionsModifierRE.test(name)) {
    options = {}
    let m
    while ((m = name.match(optionsModifierRE))) {
      name = name.slice(0, name.length - m[0].length)
      ;(options as any)[m[0].toLowerCase()] = true
    }
  }

  const type = name[2] === ':' ? name.slice(3) : hyphenate(name.slice(2))
  return {
    type,
    options
  }
}
