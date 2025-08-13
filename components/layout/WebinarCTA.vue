<template>
  <div v-if="!isHome" class="webinar-cta bg-primary-aqua py-2 px-4">
    <p>
      <strong>College Scorecard Learning Opportunity:</strong>
      Register for a free webinar on using the College Scorecard.
      <NuxtLink class="text-white" to="/resources#webinar">Register</NuxtLink>
    </p>
  </div>
</template>

<script setup>
const route = useRoute()
const isHome = computed(() => route.path === '/')

</script>

<style scoped lang="scss">
.webinar-cta {
  font-size: 14px;
}
</style>