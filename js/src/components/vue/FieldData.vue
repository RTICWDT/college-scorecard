<template>
  <v-row class="pa-5">
    <v-col sm="4" class="pa-0">
      <p class="overline mb-0">Number of Graduates</p>
      <p >{{fos.ipeds_award_count | separator }}</p>
    </v-col>
    <v-col sm="8" class="pa-0">
      <v-row>
        <v-col class="pa-0">
          <p class="overline mb-0">Median Debt</p>
          <p v-if="fos.median_debt" >{{fos.median_debt | numeral('$0,0') }}</p>
          <p v-else>--</p>
        </v-col>
        <v-col class="pa-0">
          <p class="overline mb-0">Monthly Debt Payment</p>
          <p >$NNN/mo.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pa-0">
          <p class="overline mb-0">Median Earnings</p>
          <p v-if="fos.median_earnings">{{fos.median_earnings | numeral('$0,0') }}</p>
          <p v-else>--</p>
        </v-col>
        <v-col class="pa-0">
          <p class="overline mb-0">Monthtly Earnings</p>
          <p >$NNN/mo</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["fos"]
};
</script>