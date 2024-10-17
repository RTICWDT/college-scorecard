import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useCompareStore = defineStore('compare', {
  state: () => ({
    fos: useLocalStorage('fos', []),
    institutions: useLocalStorage('institutions', []),
    drawerOpen: useLocalStorage('drawerOpen', false),
    clearForm: false,
    outboundUrl: null,
    highlightedFos: null,
    highlightedInstitution: null,

    temporaryFos: null,
    temporaryInstitutions: null,
  }),

  getters: {
    getInstitutions: (state) => state.institutions,
    getFieldsOfStudy: (state) => state.fos,
  },

  actions: {
    toggleSchool(obj) {
      const index = this.institutions.findIndex(inst => inst.id === obj.id)

      if (index !== -1) {
        this.institutions.splice(index, 1)
      } else {
        if (this.institutions.length < 10) {
          this.institutions.push(obj)
        }
      }
    },

    removeSchool(obj) {
      const index = this.institutions.findIndex(inst => inst.id === obj.id)
      if (index !== -1) {
        this.institutions.splice(index, 1)
      }
    },

    toggleFieldOfStudy(obj) {      
      const index = this.fos.findIndex(fos => (
        fos.code === obj.code &&
        fos.unit_id === obj.unit_id &&
        fos.credential.level === obj.credential.level
      ))
      
      if (index !== -1) {
        this.fos.splice(index, 1)
      } else {
        if (this.fos.length < 10) {
          this.fos.push(obj)
        }
      }
    },

    removeFieldOfStudy(obj) {
      const index = this.fos.findIndex(fos => (
        fos.code === obj.code &&
        fos.unit_id === obj.unit_id &&
        fos.credential.level === obj.credential.level
      ))
      
      if (index !== -1) {
        this.fos.splice(index, 1)
      }
    },

    toggleDrawer(value = null) {
      if (value != null) {
        this.drawerOpen = value
      } else {
        this.drawerOpen = !this.drawerOpen
      }
    },

    clearForm() {
      this.clearForm = true
    },

    setOutboundUrl(value = null) {
      this.outboundUrl = value
    }
  },
})