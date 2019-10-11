<template>
  <v-app>
    <!-- background image -->
    <v-content>
      <div class="home-splash">
        <v-container class="pt-0">
          <v-row>
            <v-col cols="12">
              <h1 class="white--text text-uppercase text-center">Find the Right Fit.</h1>
              <p
                class="white--text text-center"
              >Find out about colleges: their programs, costs, admissions, results, and more.</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="10" offset-sm="1" md="8" offset-md="2" class='d-none d-sm-flex pb-10'>
              <!-- Search Form Component -->
              <v-tabs
              grow
              background-color="rgba(0,0,0,0)"
              color="white"
              slider-size="8"
              slider-color="#74B3E8"
              class='ma-0'
              show-arrows
              >
                <v-tab>
                  <span class='hidden-sm-and-down'>Custom Search</span>
                  <span class='hidden-md-and-up'>Search</span>
                </v-tab>
                <v-tab>Name Search</v-tab>
                <v-tab>Show Me Options</v-tab>
                <v-tab-item>
                  <v-card class="px-5 pt-0 pb-5">
                    <search-form @search-query="directToSearch" />
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card class="pa-5 mb-3">
                    <name-autocomplete />
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card style="min-height: 300px" class="pa-5">
                    <p
                      class="my-2 text-center"
                    >Select one or more options to create a list of schools that fit your needs.</p>
                    <canned-search-container @canned-search-submit="directToSearch"></canned-search-container>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-col>
            <v-col cols="12" class="pa-5 d-block d-sm-none">
              <v-expansion-panels class='mb-2' v-model="mobilePanels">
                <v-expansion-panel>
                  <v-expansion-panel-header>Name Search</v-expansion-panel-header>
                  <v-expansion-panel-content><name-autocomplete /></v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-expansion-panels class='mb-2'>
                <v-expansion-panel>
                  <v-expansion-panel-header>Custom Search</v-expansion-panel-header>
                  <v-expansion-panel-content class='pa-0 ma-0 mt-n5 mx-n5'><search-form @search-query="directToSearch" /></v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels >
              <v-expansion-panels class='mb-2'>
                <v-expansion-panel>
                  <v-expansion-panel-header>Show Me Options</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <p class="my-2">Select one or more options to create a list of schools that fit your needs.</p>
                    <canned-search-container @canned-search-submit="directToSearch" class='mx-5'></canned-search-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class='homeContent mt-5'>
        <v-container class='pa-0 my-0'>
          <v-row class='pa-0'>
            <v-col cols="12" sm="5" offset-sm="1" class='homeCallout apprenticeships pa-0 my-0 mr-sm-3'>
              <h2 class="title">Alternative Pathways<br />to a Career</h2>

              <p><strong>Apprenticeships</strong> are another great way to jumpstart your career.</p>
              <p>
                <v-btn
                  rounded
                  color="secondary"
                  href="https://www.apprenticeship.gov/apprenticeship-finder"
                  target="_blank"
                >Find one that's right for you!</v-btn>
              </p>
              <p>Curious what careers are out there? <strong>O*NET’s career explorer</strong> is there to help!</p>
              <p>
                <v-btn
                  rounded
                  color="secondary"
                  href="https://www.onetonline.org/find/"
                  target="_blank"
                >Explore Careers</v-btn>
              </p>
            </v-col>
            <v-col cols="12" sm="5" class='homeCallout paying pa-0 my-0 ml-sm-3'>
              <paying-for-college />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>
<style lang="scss" scoped>
@import 'sass/_variables.scss';
.home-splash {
  background-repeat: repeat;
  background-color: #246498;
  background-image: url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%233d82b1' fill-opacity='0.24' fill-rule='evenodd'/%3E%3C/svg%3E");
  min-height: 500px;
  padding-top: 1.5rem;
  background-size: auto;
}
.v-tab{
  font-family: $header-font-family;
  font-size: 1rem;
  font-weight: bold;
  color: #bbbbbb !important;
}
.v-tab.v-tab--active{
  color: #FFFFFF !important;
}
.homeContent{
  background-color: #B5D7F4;
}

</style>
<style lang="scss">
.homeCallout{
  background-color: #FFFFFF;
  h2{
    font-weight: bold !important;
    color: #FFFFFF;
    text-align: center;
    padding: 1rem;
    margin-bottom: 2rem !important;
  }
  p{
    text-align:center;
    padding: 0rem 2rem 0.4rem;
  }
  &.apprenticeships h2{
    background-color: #436692;

  }
  &.paying h2{
    background-color: #80A771;
  }
}
</style>
<script>
import PayingForCollege from "components/vue/PayingForCollege.vue";
import CannedSearchContainer from "components/vue/CannedSearchContainer.vue";
import querystring from "querystring";
import SearchForm from "components/vue/SearchForm.vue";
import NameAutocomplete from "components/vue/NameAutocomplete.vue";
export default {
  components: {
    "paying-for-college": PayingForCollege,
    "canned-search-container": CannedSearchContainer,
    "search-form": SearchForm,
    "name-autocomplete": NameAutocomplete
  },
  props: ["baseUrl"],
  data() {
    return {
      showSidebar: true,
      sidebar: {
        fixed: false,
        absolute: true
      },
      mobilePanels: 0
    };
  },
  methods: {
    // handleCannedSearchClick(cannedSearchData){
    //   this.directToSearch(cannedSearchData);
    // },
    directToSearch(params) {
      // Generate URL based on params,
      let qs = querystring.stringify(params);
      let url =
        "/search/?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":");

      // Direct to location.
      window.location.href = url;
    },
    toggleFixed(e) {
      if (window.scrollY < 105) {
        this.sidebar.absolute = true;
        this.sidebar.fixed = false;
      } else {
        this.sidebar.absolute = false;
        this.sidebar.fixed = true;
      }
    }
  }
};
</script>