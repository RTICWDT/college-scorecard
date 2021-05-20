<template>
  <router-view
    :compareFieldsOfStudy="[]"
    :compareSchools="[]"
    @compare-update-selection="refreshCompareSchools"
    @toggle-compare-school="toggleCompareItem"
    :is-loading="isLoading"
    @loading="isLoading = $event"
  />
</template>

<static-query>
query {
  metadata {
    siteName
    siteDescription
  }
}
</static-query>

<script>
import "~/js/filters.js"
import "~/js/mixins.js"

import { localStorageKeys } from "~/js/constants.js"
import { LocalStorage } from "~/js/localStoage.js"
import { EventBus } from "~/js/EventBus.js"

export default {
  data() {
    return {
      results: {},
      site: {
        data: {
          all: null,
          states: null,
          programs: null,
          religiousAffiliations: null,
          specializedMission: null,
        },
      },
      isLoading: true,
      compareSchools: null,
      compareFieldsOfStudy: null,
    }
  },

  metaInfo() {
    return {
      title: this.$static.metadata.siteName,
      meta: [
        {
          key: "description",
          name: "description",
          content: this.$static.metadata.siteDescription,
        },
      ],
    }
  },
  created() {
    this.refreshCompareSchools()
  },
  methods: {
    // Refresh Compare Schools from Local Storage.
    refreshCompareSchools() {
      this.compareSchools = LocalStorage.selectAll(localStorageKeys.COMPARE_KEY)
      this.compareFieldsOfStudy = LocalStorage.selectAll(
        localStorageKeys.COMPARE_FOS_KEY
      )
    },
    // Toggle Compare School in local storage.
    toggleCompareSchool(school) {
      // Prepare Data, Make a call to the picc function.
      let schoolData = {
        dataset: {
          // bind:"selected_school",
          school: "compare-schools",
          schoolId: school.schoolId
            ? String(school.schoolId)
            : String(school.id),
          schoolName: school.schoolName
            ? school.schoolName
            : school["school.name"],
        },
      }

      // picc.school.selection.vueToggle(schoolData);
      LocalStorage.toggleCompare(schoolData, localStorageKeys.COMPARE_KEY)
      this.refreshCompareSchools()
    },
    // General function for adding item to local storage
    toggleCompareItem(item, storageKey = localStorageKeys.COMPARE_KEY) {
      // Need where it goes,
      let data = {}

      let previousCompareCount =
        this.compareSchools.length + this.compareFieldsOfStudy.length

      switch (storageKey) {
        case localStorageKeys.COMPARE_KEY:
          data = {
            schoolId: item.schoolId ? String(item.schoolId) : String(item.id),
            schoolName: item.schoolName ? item.schoolName : item["school.name"],
          }
          break
        case localStorageKeys.COMPARE_FOS_KEY:
          data = {
            institutionName: item.institutionName,
            credentialTitle: item.credentialTitle,
            fosTitle: item.fosTitle,
            id: item.id,
            code: item.code,
            credentialLevel: item.credentialLevel,
          }
          break
        default:
          data = {
            schoolId: item.schoolId ? String(item.schoolId) : String(item.id),
            schoolName: item.schoolName ? item.schoolName : item["school.name"],
          }
          break
      }

      LocalStorage.toggleCompare(data, storageKey)
      this.refreshCompareSchools()

      // Toggle compare drawer when first element is added.
      if (previousCompareCount === 0) {
        EventBus.$emit("compare-drawer-show", true)
      }
    },
  },
}
</script>
