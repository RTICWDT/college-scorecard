<template>
  <p>
    Veterans are eligible for higher education funding through the G.I. Bill benefits. 
    Use the
    <a
      href="https://www.vets.gov/gi-bill-comparison-tool"
      target="_blank"
      @click="analytics.transitionOutboundLink($event)"
      :class="'link-' + props.theme"
    >
      GI Bill<sup>®</sup> comparison tool
      <v-icon size="x-small" color="terriary-green">mdi-open-in-new</v-icon>
    </a>
    to learn about education programs and compare benefits 
    by school.
  </p>
  <Spacer :height="10" />
  <p>
    <a
      href="https://www.vets.gov/gi-bill-comparison-tool"
      target="_blank"
      @click="analytics.transitionOutboundLink($event)"
    >
      <img
        v-if="props.theme === 'dark'"
        src="~/assets/images/VA-Logo.svg"
        style="max-width: 300px"
        alt="VA Logo"
        width="300"
        height="67"
        contain
      />
      <img
        v-if="props.theme === 'light'"
        src="~/assets/images/VA-Logo-light.png"
        style="max-width: 300px"
        alt="VA Logo"
        width="300"
        height="67"
        contain
      />
    </a>
  </p>
</template>

<style scoped lang="scss">
.link-dark {
  color: use-theme('tertiary-green') !important;
}

.link-light {
  color: use-theme('secondary-green') !important;
}

p {
  max-width: 600px;
}
</style>

<script setup>
const props = defineProps({
  theme: String,
  default: 'dark'
})

const analytics = useAnalytics();
</script>