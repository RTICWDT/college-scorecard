<template>
  <v-app>
    <v-navigation-drawer
        v-model="showSidebar"
        app
        width="300"
        class="searchSidebar"
        v-scroll="toggleFixed"
        :absolute="sidebar.absolute"
        :fixed="sidebar.fixed"
      >
        <!-- Search Form Component -->
        <search-form
          @search-query="directToSearch"
        />

      </v-navigation-drawer>

    <!-- background image -->
    <v-content>
    <div class="home-splash">
    <v-container class="pt-0">
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <div class="text-center">
            <h1  class="white--text text-uppercase">Find the Right Fit.</h1>
            <p class="white--text">Find out about colleges: their programs, costs, admissions, results, and more.</p>
            <v-card style='min-height: 300px' class='pa-5'>
              <canned-search-container @canned-search-submit="directToSearch"></canned-search-container>
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
          <paying-for-college />
        </v-col>  
      </v-row>
    </v-container>
        <v-btn
            fab
            fixed
            bottom
            right
            color="secondary"
            rounded
            @click="showSidebar = !showSidebar"
            v-if="$vuetify.breakpoint.mdAndDown"
          >
            <v-icon>fas fa-search</v-icon>
          </v-btn>
    </v-content>
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
import PayingForCollege from 'components/vue/PayingForCollege.vue';
import CannedSearchContainer from 'components/vue/CannedSearchContainer.vue';
import querystring from "querystring";
import SearchForm from 'components/vue/SearchForm.vue';

export default {
  components:{
    'paying-for-college': PayingForCollege,
    'canned-search-container': CannedSearchContainer,
    'search-form': SearchForm
  },
  props: ["baseUrl"],
  data(){
    return{
      showSidebar: true,
      sidebar: {
        fixed: false,
        absolute: true
      },
    }
  },
  methods:{
    // handleCannedSearchClick(cannedSearchData){
    //   this.directToSearch(cannedSearchData);
    // },
    directToSearch(params){
      // Generate URL based on params,
      let qs = querystring.stringify(params);
      let url =  '/search/?' + qs.replace(/^&+/, '')
        .replace(/&{2,}/g, '&')
        .replace(/%3A/g, ':');

      // Direct to location.
      window.location.href = url;
    },
    toggleFixed(e) {
      if (window.scrollY < 105 ) {
        this.sidebar.absolute = true;
        this.sidebar.fixed = false;
      } else {
        this.sidebar.absolute = false;
        this.sidebar.fixed = true;
      }
    },
  }
};
</script>