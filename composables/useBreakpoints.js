// i don't know how to make this auto-import through nuxt so this is a mini hack
// as all composables are auto-imported

import { useDisplay } from 'vuetify'

export function useBreakpoints() {
  return useDisplay()
}