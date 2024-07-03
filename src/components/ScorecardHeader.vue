<style lang="scss" scoped>
@import "~/sass/_variables";

header {
  z-index: 101 !important;
  .logo {
    display: inline-block;
    vertical-align: middle;

    img {
      height: 65px;

      @media screen and (max-width: 600px) {
        height: 50px !important;
      }
    }
  }

  #mobile-nav-icon {
    width: 20%;
    button {
      color: white;
    }
  }

  #nav-site-title {
    width: 40%;

    @media screen and (max-width: 960px) {
      width: 80%;
    }
  }

  #nav-main-navigation {
    width: 60%;
    color: white;
    text-align: right;

    ul {
      list-style-type: none;

      li {
        display: inline;
      }

      li a {
        text-decoration: none;
        color: white !important;
        font-size: 1rem;
        margin-right: 40px;
        letter-spacing: 0.235px;
      }

      li a.disabled {
        cursor: default;
        color: white;
      }

      li a:hover:not(.nav-active),
      a:focus:not(.nav-active) {
        color: white;
        text-decoration: none;
        border-bottom: 3px solid #97cff5;
        padding-bottom: 10px;
      }

      li .nav-active {
        color: $nav-active-color !important;
        text-decoration: none;
        padding-bottom: 10px;
        border-bottom: 3px solid #97cff5;
        a {
          font-weight: bold;
        }
      }
    }

    ul li a {
      text-decoration: none;
      color: white;
    }

    @media screen and (max-width: 960px) {
      // Text Resize
    }
  }

  #nav-search-container {
    border-radius: 50%;
    background-color: #0075b2;
    margin: 0 auto;
    width: 50px;
    height: 50px;
    padding-top: 8px;
  }

  #mobile-navigation-container {
    a {
      text-decoration: none;
      color: white !important;
      font-size: 1.4rem;
    }

    a:hover,
    a:focus {
      color: white;
    }
  }

  .nav-compare-icon {
    vertical-align: middle;
  }
}
</style>

<template>
  <client-only>
    <div class="d-print-none">
      <div>
        <v-app-bar
          app
          clipped-left
          :height="$vuetify.breakpoint.xsOnly ? 105 : 130"
          color="#102E52"
          class="pa-0 ma-0"
          flat
        >
          <div class="show-on-focus-container">
            <div class="show-on-focus">
              <a tabindex="1" @click="skipNav()" href="#" class="d-sr-only-focusable"
                >Skip to main content</a
              >
            </div>
          </div>
          <div id="nav-site-title" style="margin-top: 20px">
            <a :href="$url('/')"
              ><div class="logo">
                <img
                  :src="$url('/img/US-DOE-CollegeScorecard-Logo.svg')"
                  alt="US Department of Education College Scorecard"
                />
              </div>
            </a>
          </div>

          <!-- Medium and above navigation -->
          <div id="nav-main-navigation" class="d-none d-md-block">
            <nav>
              <ul>
                <li>
                  <a
                    :href="$url('/')"
                    :class="{ 'nav-active': activeLink === '/' }"
                    >Home</a
                  >
                </li>

                <li>
                  <a
                    :href="$url('/data')"
                    :class="{ 'nav-active': activeLink === 'data' }"
                    >About the Data</a
                  >
                </li>

                <li>
                  <a
                    :href="$url('/search')"
                    :class="{ 'nav-active': activeLink === 'search' }"
                    >Search</a
                  >
                </li>

                <li style="display: inline-table">
                  <a
                    :class="{
                      'nav-active': activeLink === 'compare',
                      'pr-2 mr-5': true,
                      disabled: disableCompare,
                    }"
                    aria-label="Navigate to compare page"
                    @click="handleCompareLinkClick(`/compare`)"
                    >Compare:</a
                  >

                  <!-- Institution Compare Button -->
                  <v-badge
                    class="nav-compare-icon mb-2 mr-3"
                    bottom
                    offset-x="14"
                    offset-y="10"
                    :content="currentSchoolCount()"
                    :value="currentSchoolCount()"
                    color="#E3EEF6"
                  >
                    <v-btn
                      small
                      fab
                      color="#83C38C"
                      @click="handleCompareIconClick"
                      aria-label="Show Compare Drawer"
                    >
                      <v-icon color="black">
                        fas fa-university
                      </v-icon>
                    </v-btn>
                  </v-badge>

                  <!-- FoS Compare Button -->
                  <v-badge
                    class="nav-compare-icon mb-2"
                    bottom
                    offset-x="14"
                    offset-y="10"
                    :content="currentFieldOfStudyCount()"
                    :value="currentFieldOfStudyCount()"
                    color="#E3EEF6"
                  >
                    <v-btn
                      small
                      fab
                      color="#fdbf32"
                      @click="handleCompareIconClick"
                      aria-label="Show Compare Drawer"
                    >
                      <v-icon color="black">
                        fas fa-award
                      </v-icon>
                    </v-btn>
                  </v-badge>
                </li>

                <li></li>
              </ul>
            </nav>
          </div>

          <div id="mobile-nav-icon" class="d-md-none">
            <v-app-bar-nav-icon
              class="float-right"
              @click="drawer = true"
              aria-label="Menu"
            >
            </v-app-bar-nav-icon>
          </div>
        </v-app-bar>
      </div>
      <USABanner />

      <!-- Mobile Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        v-show="drawer"
        fixed
        temporary
        disable-resize-watcher
        right
        style="top: 21px;"
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
      <a id="main-content"></a>
    </div>
  </client-only>
</template>

<script>
import USABanner from "@/components/USABanner.vue"
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
