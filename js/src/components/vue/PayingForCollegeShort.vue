<template>
  <div>
    <h2 class="title mb-2 font-weight-bold">Start Your FAFSA&#174; Application</h2>
    <p>
      To receive financial aid, you must complete the Free Application for Federal Student Aid (FAFSA). Use the 
      <a
        href="https://studentaid.ed.gov/sa/types#aid-from-the-federal-government"
        target="_blank"
        @click="trackOutboundLink($event)"
      >FAFSA4caster</a> to see how much aid may be available to you.
    </p>
    <p class="text-center">
      <v-btn
        large
        color="secondary"
        href="https://fafsa.ed.gov/"
        target="_blank"
        @click="trackOutboundLink($event)"
      >Start Your FAFSA&reg;<br/> Application</v-btn>
    </p>    
  </div>
</template>

<script>
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js"
export default {
  mixins: [AnalyticsEvents]
}
</script>