<style lang="scss" scoped>
@import "~/sass/_variables";

header {
  position: sticky;
  z-index: 9999;
  width: 100%;
  top: 0;
}

#skip-content-tab {
  position: absolute;
  opacity: 0;
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  width: 180px;
  text-align: center;

  &:focus-within {
    opacity: 1;
  }
}

nav {
  ul {
    list-style-type: none;

    li {
      padding: 0 12px;

      a {
        font-weight: bold;
        text-decoration: none;
        color: white;
        padding-bottom: 10px;

        &.active {
          border-bottom: 3px solid #97cff5;
        }
      }

    }
  }
}
</style>

<template>
  <client-only>
    <header class="d-print-none">
      <USABanner />
    
      <div id="skip-content-tab" style="background-color: white;">
        <a tabindex="1" @click="skipNav()" href="#">
          Skip to main content
        </a>
      </div>  

      <div class="d-flex px-5 py-5" style="background-color: #102E52; align-items: center; justify-content: space-between;">
        <div>
          <a :href="$url('/')">
            <div class="logo">
              <img
                :src="$url('/img/US-DOE-CollegeScorecard-Logo.svg')"
                alt="US Department of Education College Scorecard"
                width="350px"
              />  
            </div>
          </a>
        </div>

        <!-- Medium and above navigation -->
        <div class="d-none d-md-block">
          <nav>
            <ul class="d-flex text-white">
              <li>
                <a :href ="$url('/')":class="{ 'active': activeLink === '/' }">
                  Home
                </a>
              </li>

              <li>
                <a :href ="$url('/search')":class="{ 'active': activeLink === 'search' }">
                  Search
                </a>
              </li>

              <li>
                <a :href ="$url('/search')":class="{ 'active': activeLink === 'search' }">
                  Compare
                </a>
              </li>

              <li>
                <a :href="$url('/search')" :class="{ 'active': activeLink === 'search' }">
                  Resources
                </a>
              </li>

              <li>
                <a :href="$url('/data')" :class="{ 'active': activeLink === 'data' }">
                  About the Data
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Mobile Nav Bar -->
        <div id="mobile-nav-icon" class="d-md-none">
          <v-app-bar-nav-icon
            class="float-right"
            @click="drawer = true"
            aria-label="Menu"
          >
          </v-app-bar-nav-icon>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        v-show="drawer"
        fixed
        temporary
        disable-resize-watcher
        right
        color="white"
      >
        <v-list nav>
          <v-list-item-group v-model="group">
            <v-list-item
              class="mobile-navigation-item"
              @click="mobileNavClick(`/`)"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Home
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              class="mobile-navigation-item"
              @click="mobileNavClick(`/data`)"
            >
              <v-list-item-content>
                <v-list-item-title class="mobile-navigation-item">
                  About the Data
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              class="mobile-navigation-item"
              @click="mobileNavClick(`/search`)"
            >
              <v-list-item-content>
                <v-list-item-title class="mobile-navigation-item">
                  Search
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              class="mobile-navigation-item"
              @click="mobileNavClick(`/compare/?toggle=institutions`)"
            >
              <v-list-item-content>
                <v-list-item-title class="mobile-navigation-item">
                  Compare Institutions
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              class="mobile-navigation-item"
              @click="mobileNavClick(`/compare/?toggle=fos`)"
            >
              <v-list-item-content>
                <v-list-item-title class="mobile-navigation-item">
                  Compare Fields of Study
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </header>
  </client-only>
</template>

<script>
import USABanner from "@/components/USABannerNew.vue"
export default {
  components: { USABanner },
  data() {
    return {
      drawer: false,
      group: false,
      activeLink: null,
    }
  },
  mounted() {
    this.$store.commit("toggleDrawer", false)
  },
  computed: {
    disableCompare() {
      return (
        this.compareFieldsOfStudyCount == 0 &&
        this.compareInstitutionsCount == 0
      )
    },
  },
  watch: {
    $route() {
      this.setActiveLink()
    },
  },
  methods: {
    setActiveLink() {
      let path = process.isClient ? window.location.pathname : ""
      if (path.match(/search/)) {
        this.activeLink = "search"
      } else if (path.match(/compare/)) {
        this.activeLink = "compare"
      } else if (path.match(/data/)) {
        this.activeLink = "data"
      } else if (path.match(/school/)) {
        this.activeLink = null
      } else if (path.match(/\//)) {
        this.activeLink = "/"
      } else {
        this.activeLink = null
      }
    },
    mobileNavClick(urlString) {
      //window.location.href = this.$url(urlString)
      this.$router.push(urlString)
    },
    handleCompareIconClick(resourceType = "institution") {
      this.$store.commit("toggleDrawer", true)
    },
    handleCompareLinkClick(urlString) {
      if (
        this.compareFieldsOfStudyCount == 0 &&
        this.compareInstitutionsCount == 0
      ) {
        this.$store.commit("toggleDrawer", false)
      } else {
        this.$router.push(urlString)
      }
    },
    currentSchoolCount() {
      return this.$store.state.institutions.length
    },
    currentFieldOfStudyCount() {
      return this.$store.state.fos.length
    },
    skipNav() {
      var focusable = document
        .getElementsByTagName("main")[0]
        .querySelectorAll('button, [href], input, [tabindex="0"]')
      var first = focusable[0]
      var last = focusable[focusable.length - 1]

      first.focus()
    },
  },
  created() {
    this.setActiveLink()
  },
}
</script>
