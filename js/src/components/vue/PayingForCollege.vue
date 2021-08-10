<template>
  <div>
    <h2 class="title mb-2">Learn More About Paying for College</h2>
    <p>
      Paying for college can be a concern, but there are options to help! You can learn more about the types of financial aid that are available at
      <a
        href="https://studentaid.ed.gov/sa/types#aid-from-the-federal-government"
        target="_blank"
        @click="trackOutboundLink($event)"
      >StudentAid.gov
        <v-icon
          x-small
          class="green-link pl-1"
        >
          fas fa-external-link-alt
        </v-icon>        
      </a>.
    </p>
    <p>
      To receive financial aid, you must complete the
      <em>Free Application for Federal Student Aid</em> (FAFSA&reg;) form. You can use
      <!--prettyhtml-ignore-->
      <a href="https://fafsa.ed.gov/FAFSA/app/f4cForm" target="_blank" @click="trackOutboundLink($event)">FAFSA<em>4caster</em> 
        <v-icon
          x-small
          class="green-link pl-1"
        >
          fas fa-external-link-alt
        </v-icon>        
      </a>
      to see how much aid may be available to you.
    </p>

    <p class="text-center">
      <v-btn
        rounded
        color="secondary"
        href="https://fafsa.ed.gov/"
        target="_blank"
        @click="trackOutboundLink($event)"
      >Start Your FAFSA&reg;<br/>Application
        <v-icon
          x-small
          class="pl-1"
          style="margin-top: 15px;margin-left: -24px;"
        >
          fas fa-external-link-alt
        </v-icon>        
      </v-btn>
    </p>

    <p>
      Don't forget: Do fill out the FAFSA® form, but also look into other programs such as
      <a
        href="https://www.vets.gov/gi-bill-comparison-tool"
        target="_blank"
        @click="trackOutboundLink($event)"
      >GI Bill Benefits
        <v-icon
          x-small
          class="green-link pl-1"
        >
          fas fa-external-link-alt
        </v-icon>        
      </a> that may also help you pay for school.
    </p>
  </div>
</template>

<script>
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js"
export default {
  mixins: [AnalyticsEvents]
}
</script>