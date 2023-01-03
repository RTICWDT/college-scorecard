<template>
  <div>
    <h2 class="title mb-2">Start Your FAFSA&reg; Application</h2>
    <div class="my-4">
      <p>
      To receive financial aid, you must complete the
      <em>Free Application for Federal Student Aid</em> (FAFSA&reg;) form.
    </p>
      <p>
      Use
      <!--prettyhtml-ignore-->
      <a
        :href="$url('/school/transition/')"
        target="_blank"
        @click="transitionOutboundLink($event, 'https://studentaid.gov/aid-estimator/')"
        >Federal Student Aid Estimator<v-icon
                      x-small
                      color="#007000"
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>       
        </a
      >
      to see how much aid may be available to you.
    </p>
    </div>

    <div class="text-center my-4">
      <v-btn
        rounded
        color="secondary"
        :href="$url('/school/transition/')"
        target="_blank"
        @click="transitionOutboundLink($event, 'https://studentaid.gov/h/apply-for-aid/fafsa')"
        >Start Your FAFSA&reg; Application<v-icon
            x-small
            color="white"
            class="pl-1 pb-1 align-self-end"
            style=""
          >
            fas fa-external-link-alt
          </v-icon>        
        </v-btn
      >
    </div>


  </div>
</template>

<script>
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
export default {
  mixins: [AnalyticsEvents],
}
</script>
