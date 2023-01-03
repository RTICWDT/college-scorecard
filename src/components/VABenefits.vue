<template>
  <div>
    <div class="my-4">
      Don't forget: Do fill out the FAFSA® form, but also look into other
      programs such as
      <a
        :href="$url('/school/transition/')"
        target="_blank"
        @click="transitionOutboundLink($event,'https://www.vets.gov/gi-bill-comparison-tool')"
        >GI Bill Benefits<v-icon
                      x-small
                      color="#007000"
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon></a
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
