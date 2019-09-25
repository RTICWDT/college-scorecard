<template>
  <v-app>
    <!-- background image -->
    <div class="home-splash">
    <v-container class="pt-0">
      <v-row>
        <v-col cols="12" md="12">
          <div class="text-center">
            <h1  class="white--text">Find the Right Fit</h1>
            <p class="white--text">Compare schools now</p>
            <v-btn color="secondary" rounded href="/search/">Go!</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    </div>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <img :src="baseUrl+'/img/application.svg'" alt="Application" width="100" />
          You could be eligible for up to
          <strong>$6,095</strong>
          <strong class="less-strong">for free</strong>
          <div class="fact-words">
            in Pell grants to help pay
            for college.
            <span>No repayment needed!</span>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <img :src="baseUrl+'/img/cap.svg'" alt="Graduation cap" width="100" />
          <strong>40%</strong>
          <strong class="less-strong">of undergraduates</strong>
          <div class="fact-words">
            are
            <span>24 years or older</span>.
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <img :src="baseUrl+'/img/apprenticeships.svg'" alt="Wrench" width="100" />
          <strong>Apprenticeships</strong>
          <div class="fact-words">are another great option to jumpstart your career.</div>
          <a
            href="https://www.apprenticeship.gov/apprenticeship-finder"
            target="_blank"
            rel="noopener"
          >
            <strong class="less-strong">Find one that’s right for you.</strong>
          </a>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<style lang="scss" scoped>
.home-splash {
  background-image: url("/img/background.svg");
  background-repeat: repeat;
  min-height: 400px;
}
</style>
<script>
export default {
  props: ["baseUrl"]
};
</script>