<template>
  <div>
    <h2 class="title mb-2">Start Your FAFSA&reg; Application</h2>
    <div class="my-4">
      To receive financial aid, you must complete the
      <em>Free Application for Federal Student Aid</em> (FAFSA&reg;) form. You
      can use
      <!--prettyhtml-ignore-->
      <a
        href="https://fafsa.ed.gov/FAFSA/app/f4cForm"
        target="_blank"
        @click="trackOutboundLink($event)"
        >FAFSA<em>4caster</em><v-icon
            x-small
            class="pl-1"
          >
            fas fa-external-link-alt
          </v-icon>       
        </a
      >
      to see how much aid may be available to you.
    </div>

    <div class="text-center my-4">
      <v-btn
        rounded
        color="secondary"
        href="https://fafsa.ed.gov/"
        target="_blank"
        @click="trackOutboundLink($event)"
        >Start Your FAFSA&reg;<br/>Application<v-icon
            x-small
            color="white"
            class="pl-1 pb-1 align-self-end"
            style="position: absolute;right: 5px;"
          >
            fas fa-external-link-alt
          </v-icon>        
        </v-btn
      >
    </div>

    <div class="my-4">
      Don't forget: Do fill out the FAFSA® form, but also look into other
      programs such as
      <a
        href="https://www.vets.gov/gi-bill-comparison-tool"
        target="_blank"
        @click="trackOutboundLink($event)"
        >GI Bill Benefits</a
      >
      that may also help you pay for school.
    </div>
  </div>
</template>

<script>
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
export default {
  mixins: [AnalyticsEvents],
}
</script>
