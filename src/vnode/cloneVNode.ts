import { isVue3 } from 'vue-demi'
import * as Vue from 'vue'

import { legacyCloneVNode } from '../legacy'

export const cloneVNode = isVue3 ? Vue.cloneVNode : legacyCloneVNode
