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
            <v-col cols="12" sm="8" offset-sm="2">
              <!-- Search Form Component -->
              <v-tabs
              grow
              background-color="rgba(0,0,0,0)"
              color="white"
              slider-size="8"
              slider-color="#74B3E8"
              >
                <v-tab>Custom Search</v-tab>
                <v-tab>Name Search</v-tab>
                <v-tab>Show Me Options</v-tab>
                <v-tab-item>
                  <v-card class="pa-5">
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
            <v-col cols="12" sm="6"></v-col>
          </v-row>
        </v-container>
      </div>
      <v-container>
        <v-row>
          <v-col cols="12" md="5" offset-md="1">
            <h2 class="title">College Alternatives</h2>

            <p>Apprenticeships are another great way to jumpstart your career.</p>
            <p>
              <v-btn
                rounded
                color="secondary"
                href="https://www.apprenticeship.gov/apprenticeship-finder"
                target="_blank"
              >Find one that's right for you!</v-btn>
            </p>
            <p>Curious what careers are out there? O*NET’s career explorer is there to help!</p>
            <p>
              <v-btn
                rounded
                color="secondary"
                href="https://www.onetonline.org/find/"
                target="_blank"
              >Explore Careers</v-btn>
            </p>
          </v-col>
          <v-col cols="12" md="5">
            <paying-for-college />
          </v-col>
        </v-row>
      </v-container>
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
      }
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