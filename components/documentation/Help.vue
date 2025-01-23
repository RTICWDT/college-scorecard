<template>
  <hr />
  <p class="mb-1"><strong>Looking for Help?</strong></p>

  <p>
    Visit
    <a href="http://opendata.sta ckexchange.com/questions/tagged/co llegescorecard" @click="analytics.transitionOutboundLink($event)" target="_blank" class="mr-1">
      StackExchange<v-icon size="x-small" class="pl-1">mdi-open-in-new</v-icon>
    </a>
    or email the help desk at
    <a href="mailto:scorecarddata@rti.org">scorecarddata@rti.org</a>.
  </p>
  <p>
    For inquiries by members of the press, please contact
    <a href="mailto:press@ed.gov">press@ed.gov</a>.
  </p>
</template>

<script setup>
const analytics = useAnalytics()
</script>