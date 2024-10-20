<template>
  <div class="d-print-none">
    <div class="data-navigation">
      <v-container fluid class="py-0">
        <v-tabs
          v-model="activeTab"  
          background-color="white"
          hide-slider
          show-arrows
        >
          <div class="mb-0 mr-2 d-flex align-self-center black--text light-grey">
            <strong>SEARCH:</strong>
          </div>
          <v-tab tabindex="0" class="search-tab navigation school" @click="navigateTo('/search')" value="/search">
            Schools
            <div class="tab-border-bottom"></div>
          </v-tab>
          <v-tab tabindex="0" class="search-tab navigation fos" @click="navigateTo('/search/fos-landing')" value="/search/fos-landing">
            Field of Study
            <div class="tab-border-bottom"></div>
          </v-tab>
        </v-tabs>
      </v-container>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute();
const analytics = useAnalytics()

const navigateTo = (href) =>  {
  router.push(href)
  analytics.trackNavigation(href)
}

const tab = computed(() => {
  if (route.path.match('/search/fos')) {
    return '/search/fos-landing'
  }

  return route.path
})

const getTabFromRoute = (path) => {
  if (path.match('/search/fos')) {
    return '/search/fos-landing'
  }
  return path
}

const activeTab = ref(getTabFromRoute(route.path))

// Watch for route changes and update activeTab accordingly
watch(() => route.path, (newPath) => {
  activeTab.value = getTabFromRoute(newPath)
})

// Watch for activeTab changes and navigate if necessary
watch(activeTab, (newTab) => {
  if (newTab !== getTabFromRoute(route.path)) {
    navigateTo(newTab)
  }
})

</script>

<style lang="scss" scoped>
.tab-border-bottom {
  position: absolute;
  width: 100%;
  height: 5px;
  bottom: 0;
  background-color: transparent;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.search-tab {
  transition: background-color 0.3s, color 0.3s;
  position: relative;

  &.v-tab--selected {
    font-weight: bold;
    position: relative;
    // background-color: blue;

    &.school {
      .tab-border-bottom {
        background-color: variables.$school-green;
      }
    }

    &.fos {
      .tab-border-bottom {
        background-color: variables.$fos-orange;
      }
    }
  }
}

.data-navigation {
  background-color: white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
</style>