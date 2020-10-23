<template>
  <div class='pa-5'>
  <v-row>
      <v-col cols="12" sm="4" class="pa-0">
        <p class="overline mb-0">Number of Graduates&nbsp;<tooltip definition="fos-number-of-graduates" /></p>
        <p v-if="fos.counts.ipeds_awards2">{{ fos.counts.ipeds_awards2 | separator }}</p>
        <p v-else>--</p>        
      </v-col>
      <v-col cols="12" sm="4" class="pa-0">
        <p class="overline mb-0">Median Total Debt&nbsp;
          <tooltip v-if="!fosShowDebtAtPrior" definition="fos-median-debt" :isBranch="isBranch" />
          <tooltip v-else definition="fos-median-debt-all-schools" :isBranch="isBranch" />
        </p>
        <p v-if="fos.debt.median_debt" >{{fos.debt.median_debt | numeral('$0,0') }}</p>
        <p v-else>--</p>
      </v-col>
      <v-col cols="12" sm="4" class="pa-0">
        <p class="overline mb-0">Monthly Loan Payment&nbsp;
          <tooltip v-if="!fosShowDebtAtPrior" definition="fos-monthly-debt-payment" :isBranch="isBranch" :version="[5,6,7,8].indexOf(fos.credential.level)<0?'default':'graduate'" />
          <tooltip v-else definition="fos-monthly-debt-payment-all-schools" :isBranch="isBranch" :version="[5,6,7,8].indexOf(fos.credential.level)<0?'default':'graduate'" />
          </p>
        <p v-if="fos.debt.median_debt">{{fos.debt.monthly_debt_payment | numeral('$0,0') }}/mo.</p>
        <p v-else>--</p>
      </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" sm="4" class="pa-0 hidden-sm-and-down"></v-col>
    <v-col cols="12" sm="4" class="pa-0">
      <p class="overline mb-0">Median Earnings&nbsp;<tooltip definition="fos-median-earnings" :isBranch="isBranch" /></p>
      <p v-if="fos.earnings.median_earnings">{{fos.earnings.median_earnings | numeral('$0,0') }}</p>
      <p v-else>--</p>
    </v-col>
    <v-col cols="12" sm="4" class="pa-0">
      <p class="overline mb-0">Monthly Earnings&nbsp;<tooltip definition="fos-monthly-earnings" :isBranch="isBranch" /></p>
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
  props: ["fos"],
  computed:{
    isBranch(){
      return (this.fos.school.main_campus==0)
    }
  }
};
</script>