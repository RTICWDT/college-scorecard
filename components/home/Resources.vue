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
      <span class="text-no-wrap">
        apprenticeship.gov
        <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
      </span>
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
      <span class="text-no-wrap">
        MyNextMove.org
        <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
      </span>
    </a>
    tool for career exploration and job analysis.
  </p>
  <hr />
  <p>
    Find training programs: compare completion rates, employment
    rates, and more on
    <a class="home-callout" href="https://trainingproviderresults.gov" target="_blank"
      @click="analytics.transitionOutboundLink($event)">
      <span class="text-no-wrap">
        TrainingProviderResults.gov
        <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
      </span>
    </a>.
  </p>
  <hr />
  <p>
    Visit
    <a class="home-callout" href="https://careeronestop.org" target="_blank"
      @click="analytics.transitionOutboundLink($event)">
      <span class="text-no-wrap">
        CareerOneStop.org
        <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
      </span>
    </a>, your source for career exploration training and jobs.
  </p>
  <hr />
  <p>
    Explore the
    <a class="home-callout" href="https://www.bls.gov/ooh/" target="_blank" @click="analytics.transitionOutboundLink($event)">
      <span class="text-no-wrap">
        Occupational Outlook Handbook (OOH)
        <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
      </span>
    </a>
    for detailed information about over 300 occupational profiles.
  </p>
</template>

<style scoped lang="scss">
.home-callout {
  color: use-theme('secondary-green') !important;
}

p {
  max-width: 600px;
}
</style>

<script setup>
const analytics = useAnalytics();
</script>