import { getCurrentInstance as coreGetCurrentInstance } from 'vue'
import { isVue2 } from 'vue-module-demi'

export function getCurrentInstance(): any {
  return isVue2 ? coreGetCurrentInstance()?.proxy : coreGetCurrentInstance()
}
