<template>
  <div class="d-print-none">
    <div class="data-navigation">
      <v-container class="py-0 pl-5">
        <v-tabs
          v-model="tab"  
          background-color="white"
          hide-slider
          show-arrows
        >
          <v-tab tabindex="0" class="data-tab navigation" @click="navigateTo('/data/')" value="data">Download the Data</v-tab>
          <v-tab tabindex="0" class="data-tab navigation" @click="navigateTo('/data/data-documentation/')" value="data-documentation">Data Documentation</v-tab>
          <v-tab tabindex="0" class="data-tab navigation" @click="navigateTo('/data/api-documentation/')" value="api-documentation">API Documentation</v-tab>
          <v-tab tabindex="0" class="data-tab navigation" @click="navigateTo('/data/changelog/')" value="changelog">Change Log</v-tab>
          <v-tab tabindex="0" class="data-tab navigation" @click="navigateTo('/data/glossary/')" value="glossary">Glossary</v-tab>
        </v-tabs>
      </v-container>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()
const analytics = useAnalytics()

const normalizePath = (path) => {
  // Remove trailing slash if present
  path = path.replace(/\/$/, '')
  // Remove '/data/' prefix to get the base route
  return path.replace(/^\/data\/?/, '').replace(/^\//, '') || 'data'
}

const navigateTo = (href) =>  {
  router.push(href)
  analytics.trackNavigation(href)
}

const tab = ref(normalizePath(route.path))
watch(() => route.path, (newPath) => { 
  tab.value = normalizePath(newPath)
})

onMounted(() => {
  tab.value = normalizePath(route.path)
})
</script>

<style scoped lang="scss">
.data-tab {
  text-transform: uppercase;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;

  &.v-tab--selected {
    background-color: use-theme('secondary-green');
    color: white;
    font-weight: bold;
  }
}

.data-navigation {
  background-color: white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
</style>