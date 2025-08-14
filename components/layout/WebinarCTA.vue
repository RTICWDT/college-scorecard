<template>
  <div v-if="!isHome && bannerStore.isWebinarBannerVisible" class="webinar-cta bg-primary-aqua py-2 px-4 d-flex">
    <p class="webinar-text">
      <strong>College Scorecard Learning Opportunity:</strong>
      Register for a free webinar on using the College Scorecard.
      <NuxtLink class="text-white" to="/resources#webinar">Register</NuxtLink>
    </p>
    <div class="webinar-close" @click="handleClose">
      <v-icon size="x-small" class="mr-1" color="white">mdi-close</v-icon>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const bannerStore = useBannerStore()

const isHome = computed(() => route.path === '/')

const handleClose = () => {
  bannerStore.hideBanner()
}

// Initialize banner state when component mounts
onMounted(() => {
  bannerStore.initializeBannerState()
})
</script>

<style scoped lang="scss">
.webinar-cta {
  font-size: 14px;
}

.webinar-text {
  flex-grow: 2;
}

.webinar-close {
  cursor: pointer;
}
</style>