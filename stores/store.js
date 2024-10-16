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
    highlightedSchool: null,
  }),

  getters: {
    getInstitutions: (state) => state.institutions,
    getFieldsOfStudy: (state) => state.fos,
  },

  actions: {
    toggleSchool(obj) {
      let entry;
      if (obj.schoolId) {
        entry = obj
      } else {
        entry = { schoolId: obj.id, schoolName: obj['school.name'] }
      }
      
      const index = this.institutions.findIndex(inst => inst.schoolId === entry.schoolId)

      if (index !== -1) {
        this.institutions.splice(index, 1)
      } else {
        if (this.institutions.length < 10) {
          this.institutions.push(entry)
        }
      }
    },

    removeSchool(obj) {
      const index = this.institutions.findIndex(inst => inst.schoolId === (obj.schoolId || obj.id))
      
      if (index !== -1) {
        this.institutions.splice(index, 1)
      }
    },

    toggleFieldOfStudy(obj) {
      let entry;
      if (obj.fosTitle) {
        entry = obj;
      } else {
        entry = {
          code: obj.code,
          credentialTitle: (obj.credential.level === 3 ? "Bachelor's Degree" : obj.credential.title), 
          fosTitle: obj.title,
          id: obj.unit_id,
          institutionName: obj.school.name,
          credentialLevel: obj.credential.level,
        }
      }
      
      const index = this.fos.findIndex(fos => 
        fos.code === entry.code && fos.id === entry.id && fos.credentialLevel === entry.credentialLevel
      )
      
      if (index !== -1) {
        this.fos.splice(index, 1)
      } else {
        if (this.fos.length < 10) {
          this.fos.push(entry)
        }
      }
    },

    removeFieldOfStudy(obj) {
      const index = this.fos.findIndex(fos => 
        fos.code === obj.code && fos.id === obj.id && fos.credentialLevel === obj.credentialLevel
      )
      
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