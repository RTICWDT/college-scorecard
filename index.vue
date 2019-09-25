<template>
  <v-app>
    <!-- background image -->
    <div class="home-splash">
    <v-container class="pt-0">
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <div class="text-center">
            <h1  class="white--text text-uppercase">Find the Right Fit.</h1>
            <p class="white--text">Find out about colleges: their programs, costs, admissions, results, and more.</p>
            <v-card style='min-height: 300px' class='pa-5'>
              <p>[Insert Good Options]</p>
              <p><v-btn color="secondary" rounded href="/search/">Go!</v-btn></p>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
    </div>
    <v-container>
      <v-row>
        <v-col cols="12" md="5" offset-md="1">
          <h2 class='title'>College Alternatives</h2>

          <p>Apprenticeships are another great way to jumpstart your career. </p>  
          <p><v-btn rounded color='secondary' href="https://www.apprenticeship.gov/apprenticeship-finder" target="_blank">Find one that's right for you!</v-btn></p>        
          <p>Curious what careers are out there? O*NET’s career explorer is there to help!</p>
          <p><v-btn rounded color='secondary' href="https://www.onetonline.org/find/" target="_blank">Explore Careers</v-btn></p>
        </v-col>
        <v-col cols="12" md="5">
          <h2 class='title'>Learn More About Paying for College</h2>
          <p>Paying for college can be a concern, but there are options to help! You can learn more about the <a href="https://studentaid.ed.gov/sa/types#aid-from-the-federal-government" target="_blank">types of financial aid</a> that are available on the student aid website.</p>
          <p>To receive financial aid, you must complete the Free Application for Federal Student Aid (FAFSA). You can use the <a href="https://fafsa.ed.gov/FAFSA/app/f4cForm" target="_blank">FAFSA calculator</a> to see how much aid may be available to you. </p>
          <p><v-btn rounded color='secondary' href="https://fafsa.ed.gov/" target="_blank">Start My FAFSA</v-btn></p>
          <p>In addition to the FAFSA, there are other programs such as the <a href="https://www.vets.gov/gi-bill-comparison-tool" target="_blank">GI Bill® Benefits</a> which may also help you pay for school.</p>
        </v-col>  
      </v-row>
    </v-container>
  </v-app>
</template>
<style lang="scss" scoped>
.home-splash {
  background-image: url("/img/background.svg");
  background-repeat: none;
  background-size: cover;
  min-height: 500px;
  padding-top: 1.5rem;
}
</style>
<script>
export default {
  props: ["baseUrl"]
};
</script>