<template>

  <h4>2-year schools</h4>
  <div v-for="institution in institutions.schools2Year">
    <slot name="data" :institution="institution">
    </slot>
  </div>

  <h4>4-year schools</h4>
  <div v-for="institution in institutions.schools4Year">
    <slot name="data" :institution="institution">
    </slot>
  </div>

  <h4>Certificate schools</h4>
  <div v-for="institution in institutions.schoolsCertificate">
    <slot name="data" :institution="institution">
    </slot>
  </div>
</template>

<script setup>
const props = defineProps({
  institutions: Object,
});
</script>

<style lang="scss" scoped>
// Add any additional styles here
</style>