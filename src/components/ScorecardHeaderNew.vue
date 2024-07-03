<style lang="scss" scoped>
@import "~/sass/_variables";

header {
  position: sticky;
  z-index: 9999;
  width: 100%;
  top: 0;

  .logo {
    display: flex;
    align-items: center;
    width: 350px;
    @media screen and (max-width: 600px) {
      width: 300px;
    }
  }
}

nav {
  ul {
    list-style-type: none;

    li {
      padding: 0 12px;
      position: relative;
      
      a {
        text-decoration: none;
        color: white;
        padding-bottom: 10px;
        cursor: pointer;

        &.active {
          font-weight: bold;
          border-bottom: 3px solid #97cff5;
        }
      }
    }
  }
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
                class="logo"
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

              <Subnav
                label="Search"
                :is-active="activeLink === 'search'"
                :items="searchItems"
              />

              <Subnav
                label="Compare"
                :is-active="activeLink === 'compare'"
                :items="compareItems"
              />

              <li>
                <a :href="$url('/resources')" :class="{ 'active': activeLink === 'resources' }">
                  Resources
                </a>
              </li>

              <Subnav
                label="About the Data"
                :is-active="activeLink === 'data'"
                :items="dataItems"
                :right-offset="'0.7rem'"
              />
            </ul>
          </nav>
        </div>

        <!-- Mobile Nav Bar -->
        <div class="d-md-none">
          <v-app-bar-nav-icon
            class="float-right"
            @click="drawer = true"
            aria-label="Menu"
            style="color: white;"
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
          <v-list-item-group v-model="group1">
            <v-list-item @click="mobileNavClick(`/`)">
              <v-list-item-content>
                <v-list-item-title>
                  HELLO
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>

          <v-list-item-group v-model="group">
            <v-list-item @click="mobileNavClick(`/`)">
              <v-list-item-content>
                <v-list-item-title>
                  Home
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="mobileNavClick(`/data`)">
              <v-list-item-content>
                <v-list-item-title >
                  About the Data
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="mobileNavClick(`/search`)">
              <v-list-item-content>
                <v-list-item-title >
                  Search Instiutions
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="mobileNavClick(`/search`)">
              <v-list-item-content>
                <v-list-item-title >
                  Search Fields of Study
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="mobileNavClick(`/compare/?toggle=institutions`)">
              <v-list-item-content>
                <v-list-item-title >
                  Compare Institutions
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="mobileNavClick(`/compare/?toggle=fos`)">
              <v-list-item-content>
                <v-list-item-title >
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
import Subnav from './Subnav.vue';
export default {
  components: { 
    USABanner,
    Subnav,
  },
  data() {
    return {
      drawer: false,
      group: false,
      activeLink: null,
      compareItems: [
        { 
          label: 'Compare Institutions', 
          action: '/compare/?toggle=institutions'
        },
        { 
          label: 'Compare Fields of Study', 
          action: '/compare/?toggle=fos'
        }
      ],
      searchItems: [
        { 
          label: 'Search Schools', 
          action: '/search'
        },
        { 
          label: 'Search Fields of Study', 
          action: '/search/fos-landing'
        }
      ],
      dataItems: [
        { 
          label: 'Download the Data', 
          action: '/data'
        },
        { 
          label: 'Data Documentation', 
          action: '/data/documentation'
        },
        { 
          label: 'API Documentation', 
          action: '/data/api'
        },
        { 
          label: 'Change Log', 
          action: '/data/changelog'
        },
        { 
          label: 'Glossary', 
          action: '/data/glossary'
        },
      ]
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
