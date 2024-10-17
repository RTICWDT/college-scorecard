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
    addSchool(obj) {
      this.institutions = this.institutions || []

      if (this.institutions.length < 10) {
        this.institutions.push({
          id: obj.id,
          school: { name: obj['school.name'] },
        })
      }
    },

    toggleSchool(obj) {
      this.institutions = this.institutions || []
      const index = this.institutions.findIndex(inst => inst.id === obj.id)
      if (index !== -1) {
        this.institutions.splice(index, 1)
      } else {
        this.addSchool(obj)
      }
    },

    removeSchool(obj) {
      const index = this.institutions.findIndex(inst => inst.id === obj.id)
      if (index !== -1) {
        this.institutions.splice(index, 1)
      }
    },

    addFieldOfStudy(obj) {
      this.fos = this.fos || []

      if (this.fos.length < 10) {
        this.fos.push({
          code: obj.code,
          unit_id: obj.unit_id,
          credential: { level: obj.credential.level },
        })
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
        addFieldOfStudy(obj)
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