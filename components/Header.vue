<template>
  <div id="skip-content-tab" style="background-color: white;">
    <a tabindex="1" @click="skipNav" href="#">
      Skip to main content
    </a>
  </div>  

  <div class="d-flex px-5 py-4" style="background-color: #102E52; align-items: center; justify-content: space-between;">
    <div>
      <NuxtLink :to="'/'">
        <div class="logo">
          <img
            :src="'/img/US-DOE-CollegeScorecard-Logo.svg'"
            alt="US Department of Education College Scorecard"
            class="logo"
          />  
        </div>
      </NuxtLink>
    </div>

    <!-- Medium and above navigation -->
    <div class="d-none d-md-block">
      <nav>
        <ul class="d-flex text-white">
          <li>
            <NuxtLink :to="'/'" :class="{ 'active': activeLink === '/' }" @click="trackNavigation('/')">
              Home
            </NuxtLink>
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
            <NuxtLink :to="'/resources'" :class="{ 'active': activeLink === 'resources' }" @click="trackNavigation('/resources')">
              Resources
            </NuxtLink>
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
      <v-btn 
        icon
        class="float-right"
        @click="drawer = !drawer"
        aria-label="Menu"
        style="color: white;"
      >
        <v-icon>$menu</v-icon>
      </v-btn>
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
    class="mobile-nav"
    style="z-index: 1001 !important;"
  >
    <v-list nav style="z-index: 1002 !important;">
      <div class="d-flex justify-end mb-5 mr-1">
        <v-btn 
          icon
          @click="drawer = !drawer"
          aria-label="Menu"
          style="color: gray;"
        >
          <v-icon>$close</v-icon>
        </v-btn>
      </div>

      <v-list-item-group>
        <v-list-item @click="mobileNavClick(`/`)" class="nav-title-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Home</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <hr />
        <p class="nav-title">Search</p>
        
        <v-list-item @click="mobileNavClick(`/search`)" class="nav-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Search Schools</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/search/fos-landing`)" class="nav-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Search Fields of Study</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <hr />
        <p class="nav-title">Compare</p>

        <v-list-item @click="mobileNavClick(`/compare/?toggle=institutions`)" class="nav-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Compare Schools</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/compare/?toggle=fos`)" class="nav-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Compare Fields of Study</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <hr />

        <v-list-item @click="mobileNavClick(`/resources`)" class="nav-title-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Resources</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <hr />
        <p class="nav-title">About the Data</p>

        <v-list-item @click="mobileNavClick(`/data`)" class="nav-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Download the Data</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/data/data-documentation`)" class="nav-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Data Documentation</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/data/api-documentation`)" class="nav-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>API Documentation</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/data/changelog`)" class="nav-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Change Log</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="mobileNavClick(`/data/glossary`)" class="nav-item">
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <span>Glossary</span>
                <v-icon class="nav-caret">$next</v-icon>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const drawer = ref(false)
const trackNavigation = (link) => {
  return true
}
const mobileNavClick = (link) => {
  return true
}
</script>

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