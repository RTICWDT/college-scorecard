<template>
  <h3 class="display-7 d-flex justify-space-between align-center">
    Alternate Pathways and Resources
  </h3>
  <hr />
  <p>
    Search for apprenticeship jobs and programs on
    <a
      class="home-callout"
      href="https://www.apprenticeship.gov/apprenticeship-finder"
      target="_blank"
      @click="analytics.transitionOutboundLink($event)"
    >
      apprenticeship.gov
      <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
    </a>
  </p>
  <hr />
  <p>
    Use the
    <a 
      class="home-callout"
      href="https://www.mynextmove.org"
      target="_blank"
      @click="analytics.transitionOutboundLink($event)"
    >
      MyNextMove.org
      <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
    </a>
    tool for career exploration and job analysis.
  </p>
  <hr />
  <p>
    Find training programs: compare completion rates, employment
    rates, and more on
    <a class="home-callout" href="https://trainingproviderresults.gov" target="_blank"
      @click="analytics.transitionOutboundLink($event)">
      TrainingProviderResults.gov
      <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
    </a>.
  </p>
  <hr />
  <p>
    Visit
    <a class="home-callout" href="https://careeronestop.org" target="_blank"
      @click="analytics.transitionOutboundLink($event)">
      CareerOneStop.org
      <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
    </a>, your source for career exploration training and jobs.
  </p>
  <hr />
  <p>
    Explore the
    <a class="home-callout" href="https://www.bls.gov/ooh/" target="_blank" @click="analytics.transitionOutboundLink($event)">Occupational Outlook Handbook (OOH)
      <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
    </a>
    for detailed information about over 300 occupational profiles.
  </p>
  <hr />
  <p>
    You can learn more about the types of financial aid that are  available at
    <a class="home-callout" href="https://studentaid.gov/" target="_blank" @click="analytics.transitionOutboundLink($event)">StudentAid.gov
      <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
    </a>
  </p>
</template>

<style lang="scss">
.home-callout {
  color: use-theme('secondary-green') !important;
}
</style>

<script setup>
const analytics = useAnalytics();
</script>