<style lang="scss" scoped>
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

.mobile-nav {
  .nav-title {
    padding-left: 8px;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
  }

  .nav-item {
    min-height: 25px;
    height: 25px;
    padding-top: 5px;
  }

  .nav-caret {
    position: relative;
    bottom: 3px;
  }

  .nav-title-item {
    font-weight: bold;
    min-height: 25px;
    height: 25px;
    margin-bottom: -3px !important;
    padding-top: 5px;
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
  <div id="skip-content-tab" style="background-color: white;">
    <a tabindex="1" @click="skipNav" href="#">
      Skip to main content
    </a>
  </div>

  <div class="d-flex px-3 py-4" style="background-color: #102E52; align-items: center; justify-content: space-between;">
    <div>
      <NuxtLink :to="'/'">
        <div class="logo">
          <img src="~/assets/images/US-DOE-CollegeScorecard-Logo.svg" alt="US Department of Education College Scorecard"
            class="logo" />
        </div>
      </NuxtLink>
    </div>

    <!-- Medium and above navigation -->
    <div class="d-none d-lg-block">
      <nav>
        <ul class="d-flex text-white mb-0">
          <li>
            <NuxtLink :to="'/'" :class="{ 'active': activeLink === '/' }" @click="navigateTo('/')">
              Home
            </NuxtLink>
          </li>

          <Subnav label="Search" :active="activeLink.match('search')" :items="searchItems" :onNavigate="navigateTo" />

          <Subnav label="Compare" :active="activeLink.match('compare')" :items="compareItems"
            :onNavigate="navigateTo" />

          <li>
            <NuxtLink :to="'/resources'" :class="{ 'active': activeLink.match('resources') }"
              @click="navigateTo('/resources')">
              Resources
            </NuxtLink>
          </li>

          <Subnav label="About the Data" :active="activeLink.match('data')" :items="dataItems" :onNavigate="navigateTo"
            :right-offset="'0.7rem'" />
        </ul>
      </nav>
    </div>

    <!-- Mobile Nav Bar -->
    <div class="d-lg-none">
      <v-btn icon class="float-right" @click="drawer = !drawer" aria-label="Menu" style="color: white; background-color: transparent;">
        <v-icon icon="mdi:mdi-menu"></v-icon>
      </v-btn>
    </div>
  </div>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer 
    v-model="drawer" 
    temporary
    disable-resize-watcher
    location="right"
    color="white"
    class="mobile-nav"
  >
    <v-list nav>
      <div class="d-flex justify-end mb-5 mr-1">
        <v-btn icon @click="drawer = !drawer" aria-label="Menu" style="color: gray;">
          <v-icon icon="mdi:mdi-close"></v-icon>
        </v-btn>
      </div>

      <div>
        <v-list-item @click="mobileNavClick(`/`)" class="nav-title-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Home</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <hr />
        <p class="nav-title">Search</p>

        <v-list-item @click="mobileNavClick(`/search`)" class="nav-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Search Schools</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/search/fos-landing`)" class="nav-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Search Fields of Study</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <hr />
        <p class="nav-title">Compare</p>

        <v-list-item @click="mobileNavClick(`/compare/?toggle=institutions`)" class="nav-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Compare Schools</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/compare/?toggle=fos`)" class="nav-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Compare Fields of Study</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <hr />

        <v-list-item @click="mobileNavClick(`/resources`)" class="nav-title-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Resources</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <hr />
        <p class="nav-title">About the Data</p>

        <v-list-item @click="mobileNavClick(`/data`)" class="nav-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Download the Data</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/data/data-documentation`)" class="nav-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Data Documentation</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/data/api-documentation`)" class="nav-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>API Documentation</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/data/changelog`)" class="nav-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Change Log</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/data/glossary`)" class="nav-item" tabindex="0">
          <v-list-item-title>
            <div class="d-flex justify-space-between">
              <span>Glossary</span>
              <v-icon class="nav-caret" icon="mdi:mdi-chevron-right"></v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const router = useRouter()

const drawer = ref(false)
const trackNavigation = (link) => {
  return true
}
const mobileNavClick = (link) => {
  trackNavigation(link)
  activeLink.value = link
  router.push(link)
  drawer.value = false
  return true
}

const navigateTo = (link) => {
  trackNavigation(link)
  activeLink.value = link
  return true
}

const activeLink = ref('/')

const compareItems = [
  {
    label: 'Compare Schools',
    action: '/compare/?toggle=institutions'
  },
  {
    label: 'Compare Fields of Study',
    action: '/compare/?toggle=fos',
  }
]
const searchItems = [
  {
    label: 'Search Schools',
    action: '/search'
  },
  {
    label: 'Search Fields of Study',
    action: '/search/fos-landing'
  }
]
const dataItems = [
  {
    label: 'Download the Data',
    action: '/data'
  },
  {
    label: 'Data Documentation',
    action: '/data/data-documentation'
  },
  {
    label: 'API Documentation',
    action: '/data/api-documentation'
  },
  {
    label: 'Change Log',
    action: '/data/changelog'
  },
  {
    label: 'Glossary',
    action: '/data/glossary'
  }
]

</script>