<template>
  <div>
    <h2 class="title mb-2 font-weight-bold">This school offers WIOA eligible training programs.</h2>
    <p>
      Some training programs are eligible for funding through the Workforce Innovation and Opportunity Act (WIOA), depending on your state and 
      local needs. Search for all eligible WIOA programs available at University State College on 
      <a
        href="https://studentaid.ed.gov/sa/types#aid-from-the-federal-government"
        target="_blank"
        @click="trackOutboundLink($event)"
      >TrainingProviderResults.gov</a>.
    </p>
  </div>
</template>

<script>
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js"
export default {
  mixins: [AnalyticsEvents]
}
</script>