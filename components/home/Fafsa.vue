<template>
  <h3 class="display-7 mb-4">Start Your FAFSA® Application</h3>
  <div style="max-width: 400px">
    <p class="mb-4">To receive financial aid, you must complete the Free Application for Federal Student Aid (FAFSA).</p>
    <p  class="mb-7">
      Use the 
      <a class="home-callout" href="https://www.bls.gov/ooh/" target="_blank" @click="analytics.transitionOutboundLink($event)">FAFSA4caster
        <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
      </a>
      to see how much aid may be available to you.
    </p>
  </div>
  <v-btn 
    color="secondary-green text-uppercase h-tag font-weight-bold" 
    href="https://studentaid.gov/h/apply-for-aid/fafsa" 
    target="_blank" 
    :height="60"
    :width="367"
    @click="analytics.transitionOutboundLink($event)"
  >
    Start Your FAFSA&reg; Application
  </v-btn>
</template>

<style lang="scss">
.home-callout {
  color: use-theme('secondary-green');
}
</style>

<script setup>
const analytics = useAnalytics();
</script>