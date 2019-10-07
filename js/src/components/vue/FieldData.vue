<template>
  <v-row class="pa-5">
    <v-col sm="4" class="pa-0">
      <p class="overline mb-0">Number of Graduates&nbsp;<tooltip definition="coming-soon" /></p>
      <p >{{fos.counts.ipeds_awards1 + fos.counts.ipeds_awards2 | separator }}</p>
    </v-col>
    <v-col sm="8" class="pa-0">
      <v-row>
        <v-col class="pa-0">
          <p class="overline mb-0">Median Debt&nbsp;<tooltip definition="coming-soon" /></p>
          <p v-if="fos.debt.median_debt" >{{fos.debt.median_debt | numeral('$0,0') }}</p>
          <p v-else>--</p>
        </v-col>
        <v-col class="pa-0">
          <p class="overline mb-0">Monthly Debt Payment&nbsp;<tooltip definition="coming-soon" /></p>
          <p v-if="fos.debt.median_debt">{{fos.debt.monthly_debt_payment | numeral('$0,0') }}/mo.</p>
          <p v-else>--</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pa-0">
          <p class="overline mb-0">Median Earnings&nbsp;<tooltip definition="coming-soon" /></p>
          <p v-if="fos.earnings.median_earnings">{{fos.earnings.median_earnings | numeral('$0,0') }}</p>
          <p v-else>--</p>
        </v-col>
        <v-col class="pa-0">
          <p class="overline mb-0">Monthtly Earnings</p>
          <p v-if="fos.earnings.median_earnings">{{(fos.earnings.median_earnings)/12 | numeral('$0,0') }}/mo</p>
          <p v-else>--</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Tooltip from 'components/vue/Tooltip.vue';

export default {
  components: {
    'tooltip': Tooltip
  },
  props: ["fos"]
};
</script>