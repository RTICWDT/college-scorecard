<template>
  <div class='pa-5'>
  <v-row>
      <v-col cols="12" sm="4" class="pa-0">
        <p class="overline mb-0">Number of Graduates&nbsp;<tooltip definition="fos-number-of-graduates" :school="school" /></p>
        <p v-if="fos.counts.ipeds_awards2">{{ fos.counts.ipeds_awards2 | separator }}</p>
        <p v-else>--</p>        
      </v-col>
      <v-col cols="12" sm="4" class="pa-0">
        <p class="overline mb-0">Median Total Debt&nbsp;<tooltip definition="fos-median-debt" :school="school" /></p>
        <p v-if="fos.debt.median_debt" >{{fos.debt.median_debt | numeral('$0,0') }}</p>
        <p v-else>--</p>
      </v-col>
      <v-col cols="12" sm="4" class="pa-0">
        <p class="overline mb-0">Monthly Loan Payment&nbsp;<tooltip definition="fos-monthly-debt-payment" :school="school" /></p>
        <p v-if="fos.debt.median_debt">{{fos.debt.monthly_debt_payment | numeral('$0,0') }}/mo.</p>
        <p v-else>--</p>
      </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" sm="4" class="pa-0 hidden-sm-and-down"></v-col>
    <v-col cols="12" sm="4" class="pa-0">
      <p class="overline mb-0">Median Earnings&nbsp;<tooltip definition="fos-median-earnings" :school="school" /></p>
      <p v-if="fos.earnings.median_earnings">{{fos.earnings.median_earnings | numeral('$0,0') }}</p>
      <p v-else>--</p>
    </v-col>
    <v-col cols="12" sm="4" class="pa-0">
      <p class="overline mb-0">Monthtly Earnings&nbsp;<tooltip definition="fos-monthly-earnings" :school="school" /></p>
      <p v-if="fos.earnings.median_earnings">{{(fos.earnings.median_earnings)/12 | numeral('$0,0') }}/mo</p>
      <p v-else>--</p>
    </v-col>
  </v-row>
  </div>
</template>

<script>
import Tooltip from 'components/vue/Tooltip.vue';

export default {
  components: {
    'tooltip': Tooltip
  },
  props: ["fos", "school"]
};
</script>