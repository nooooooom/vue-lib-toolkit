import { version } from 'vue'

export const isVue2 = +version.split('.')[0] !== 3
export const isVue3 = !isVue2
