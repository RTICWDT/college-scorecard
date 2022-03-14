<style lang="scss" scoped>
@import "~/sass/_variables";
header {
  z-index: 101 !important;
  .logo {
    display: inline-block;
    padding: 10px 20px 10px 30px;
    vertical-align: middle;
    margin-top: -30px;

    img {
      width: 70px;

      @media screen and (max-width: 600px) {
        width: 40px !important;
      }
    }

    @media screen and (max-width: 600px) {
      margin-top: -10px !important;
      padding: 10px 10px 10px 20px;
    }
  }
  .headerText {
    display: inline-block;
    line-height: 200%;
    margin-top: 0px;

    @media screen and (max-width: 600px) {
      line-height: 130%;
    }
  }

  .edLine {
    display: block;
    font-size: 1.12rem;
    padding-top: 15px;
    font-family: $header-font-family;
    font-weight: 700;
    text-transform: uppercase;
    color: #9c9c9c;

    @media screen and (max-width: 600px) {
      font-size: 0.6rem;
    }
  }

  .siteTitle {
    display: block;
    font-size: 2.24rem;
    font-family: $header-font-family;
    color: $white;
    @media screen and (max-width: 600px) {
      font-size: 1.19rem;
    }
  }

  #mobile-nav-icon {
    width: 20%;
    button {
      color: white;
    }
  }

  #nav-site-title {
    width: 50%;

    /*@media screen and (max-width: 670px) {*/
    /*  width:70%;*/
    /*}*/

    @media screen and (max-width: 960px) {
      width: 80%;
    }
  }

  #nav-main-navigation {
    width: 50%;
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
        font-weight: 500;
        letter-spacing: 0.235px;
      }

      li a.disabled {
        cursor: default;
        color: white;
      }

      li a:hover:not(.nav-active),
      a:focus:not(.nav-active) {
        color: white;
        font-weight: 700;
        text-decoration: none;
        letter-spacing: 0;
      }

      li .nav-active {
        color: $nav-active-color !important;
        text-decoration: none;
        font-weight: 700;
        padding-bottom: 10px;
        border-bottom: 3px solid #97cff5;
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
      <v-app-bar
        app
        clipped-left
        :height="$vuetify.breakpoint.xsOnly ? 80 : 105"
        color="#00365e"
        class="pa-0 ma-0"
        flat
      >
        <div id="nav-site-title">
          <a :href="$url('/')"
            ><div class="logo">
              <img
                :src="$url('/img/US-DeptOfEducation-Seal.png')"
                alt="Department of Education Seal"
              />
            </div>
            <div class="headerText">
              <span class="edLine">U.S. Department of Education</span
              ><span class="siteTitle">College Scorecard</span>
            </div></a
          >
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
                    <v-icon color="#122E51">
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

      <!-- Mobile Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        v-show="drawer"
        fixed
        temporary
        disable-resize-watcher
        right
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
    </div>
  </client-only>
</template>

<script>
export default {
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
  },
  created() {
    this.setActiveLink()
  },
}
</script>
