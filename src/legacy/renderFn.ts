import { toHandlerKey } from '../listeners'

export function convertLegacyEventKey(event: string): string {
  // normalize v2 event prefixes
  if (event[0] === '&') {
    event = event.slice(1) + 'Passive'
  }
  if (event[0] === '~') {
    event = event.slice(1) + 'Once'
  }
  if (event[0] === '!') {
    event = event.slice(1) + 'Capture'
  }
  return toHandlerKey(event)
}
