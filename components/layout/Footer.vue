<template>
  <div class="d-print-none">
    <div
      class="d-block pa-md-4 text-white"
      app
      absolute
      style="background-color: #10274E; z-index: 900;"
    >
      <v-container class="py-8">
        <v-row>
          <v-col>
            <ul class="d-md-flex justify-space-between ma-0 pa-0">
              <li>
                <NuxtLink to="/" :class="{ 'nav-active': activeLink === '/' }">
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/data" :class="{ 'nav-active': activeLink === 'data' }">
                  About the Data
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/search" :class="{ 'nav-active': activeLink === 'search' }">
                  Search
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :class="{ 'nav-active': activeLink === 'compare' }"
                  to="/compare"
                  aria-label="Navigate to compare page"
                  @click="handleCompareLinkClick('/compare')"
                >
                  Compare
                </NuxtLink>
              </li>
              <li></li>
            </ul>
          </v-col>
          <v-col>
            <div class="float-right">
              <p class="mb-0">
                <small>
                  Powered by <NuxtLink to="/data">College Scorecard Data</NuxtLink>
                </small>
              </p>
              <p class="mb-0">
                <small>
                  <a
                    href="https://github.com/RTICWDT/college-scorecard/releases"
                    target="_blank"
                    @click="transitionOutboundLink"
                  >
                    {{ version }}
                    <v-icon size="x-small" color="white" class="pl-1">
                      mdi-open-in-new
                    </v-icon>
                  </a>
                  | <a href="mailto:scorecarddata@rti.org">Contact Us</a> |
                  <a
                    href="http://www2.ed.gov/notices/index.html?src=ft"
                    target="_blank"
                    @click="transitionOutboundLink"
                  >
                    Notices
                    <v-icon size="x-small" color="white" class="pl-1">
                      mdi-open-in-new
                    </v-icon>
                  </a>
                  | <NuxtLink to="/data/glossary/">Glossary</NuxtLink>
                </small>
              </p>
              <p>
                <small>
                  <a
                    href="http://www.ed.gov/"
                    @click="transitionOutboundLink"
                    target="_blank"
                  >
                    U.S. Department of Education
                    <v-icon size="x-small" color="white" class="pl-1">
                      mdi-open-in-new
                    </v-icon>
                  </a>
                </small>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
li {
  list-style-type: none;
}
a {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  color: white;
}
</style>

<script setup>
import { useDisplay } from 'vuetify'

const route = useRoute()
const activeLink = ref(null)
const { smAndDown } = useDisplay()

const version = ref('3.0.3') // TODO: implement a way to get the version

const setActiveLink = () => {
  const path = process.client ? window.location.pathname : ''
  if (path.match(/search/)) {
    activeLink.value = 'search'
  } else if (path.match(/compare/)) {
    activeLink.value = 'compare'
  } else if (path.match(/data/)) {
    activeLink.value = 'data'
  } else if (path.match(/school/)) {
    activeLink.value = null
  } else if (path.match(/\//)) {
    activeLink.value = '/'
  } else {
    activeLink.value = null
  }
}

const handleCompareLinkClick = (path) => {
  // Implement your compare link click logic here
}

const transitionOutboundLink = (event) => {
  // Implement your outbound link transition logic here
}

watch(route, setActiveLink)

onMounted(() => {
  setActiveLink()
})
</script>