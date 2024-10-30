<template>
  <div class="d-print-none">
    <div class="d-block pa-md-4 text-white bg-primary-blue" style="z-index: 900;">
      <v-container :fluid="isFluid" class="py-8">
        <v-row>
          <v-col cols="6" md="9">
            <ul class="d-md-flex justify-space-between ma-0 pa-0">
              <li class="mx-2 mb-4">
                <NuxtLink to="/" class="font-weight-bold">
                  Home
                </NuxtLink>
              </li>
              <li class="mx-2 mb-4">
                <div class="font-weight-bold mb-1">
                  Search
                </div>
                <NuxtLink to="/search" class="d-block mb-1">
                  Search Schools
                </NuxtLink>
                <NuxtLink to="search/fos-landing" class="d-block mb-1">
                  Search Fields of Study
                </NuxtLink>
              </li>
              <li class="mx-2 mb-4">
                <div class="font-weight-bold mb-1">
                  Compare
                </div>
                <NuxtLink to="/compare/?toggle=institutions" class="d-block mb-1">
                  Compare Schools
                </NuxtLink>
                <NuxtLink to="/compare/?toggle=fos" class="d-block mb-1">
                  Compare Fields of Study
                </NuxtLink>
              </li>
              <li class="mx-2 mb-4">
                <NuxtLink to="/resources" class="font-weight-bold">
                  Resources
                </NuxtLink>
              </li>
              <li class="mx-2 mb-4">
                <div class="font-weight-bold mb-1">
                  About the Data
                </div>
                <NuxtLink to="/data" class="d-block mb-1">
                  Download the Data
                </NuxtLink>
                <NuxtLink to="/data/data-documentation" class="d-block mb-1">
                  Data Documentation
                </NuxtLink>
                <NuxtLink to="/data/api-documentation" class="d-block mb-1">
                  API Documentation
                </NuxtLink>
                <NuxtLink to="/data/change-log" class="d-block mb-1">
                  Change Log
                </NuxtLink>
                <NuxtLink to="/data/glossary" class="d-block mb-10">
                  Glossary
                </NuxtLink>
              </li>
            </ul>
          </v-col>
          <v-col cols="6" md="3">
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
                    @click="analytics.transitionOutboundLink"
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
                    @click="analytics.transitionOutboundLink"
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
                    @click="analytics.transitionOutboundLink"
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
const route = useRoute()
const activeLink = ref(null)
const { breakpoints } = useVuetify()

const version = ref('3.0.3') // TODO: implement a way to get the version

const isFluid = computed(() => {
  console.log(breakpoints.md.value)
  return breakpoints.md.value
})

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

}

watch(route, setActiveLink)

onMounted(() => {
  setActiveLink()
})
</script>