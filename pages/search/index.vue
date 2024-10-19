<style lang="scss" scoped>
.dolflag-chip {
  height: auto !important;
  font-size: 16px;
  white-space: normal;
  a {
    color: rgba(0, 0, 0, 0.87) !important;
  }
}

#search-institutions-dolflag {
  width: 100%;
}

.splash {
  font-family: variables.$base-font-family !important;
  background-color: variables.$bg-blue !important;
  color: variables.$white !important;
}

.bg-white {
  background-color: white;
}


.sidebar {
}

.sidebar-open {
  min-width: 390px;
  max-width: 390px;

  @include md {
    min-width: 330px;
    max-width: 330px;
  }

  @include xl {
    min-width: 600px;
    max-width: 600px;
  }
}

.sidebar-closed {
  min-width: 0px;
  max-width: 0px;
}

.sidebar-mobile {
  max-width: 100% !important;
  z-index: 1000;
}

.sidebar-open-main {
}
.sidebar-closed-main {
}
.sidebar-mobile-main.sidebar-open-main {
  display: none;
}
.sidebar-desktop-main {
}

.v-pagination-wrapper {
  margin-left: auto;
  @include xs { max-width: 320px; }
  @include sm { max-width: 500px; }
  @include md { max-width: 400px; }
  @include lg { max-width: 700px; }
}

:deep(.v-pagination__list) {
  justify-content: right;
}

.resultsNavCard {
  min-height: 152px;
  @include mdAndUp { min-height: 110px; }
}
</style>

<template>
  <!-- SPLASH -->
  <div class="splash">
    <v-container fluid>
      <v-row
        ><v-col class="pa-sm-10 pa-5">
          <h1>Search Schools</h1>
          <p>
            Search schools that might be a good fit, and add to your compare
            list to see how they match up.
          </p></v-col
        ></v-row
      >
    </v-container>
  </div>

  <!-- SEARCH BAR -->
  <v-container fluid class="elevation-2 bg-white" style="z-index: 50; position: relative;">
    <v-row>
      <v-col class="px-0 py-0">
        <v-card flat class="white d-flex flex-column flex-md-row align-md-center border-none px-3 pb-2 pt-0 pt-md-2">
          <div class="search-label my-2 my-md-0 mr-0 mr-md-2">School:</div>

          <div style="min-width: 200px">
            <SearchSchoolAutocomplete
              ref="searchSchoolRef"
              @school-name-selected="handleSchoolSelection"
              @school-name-cleared="handleSchoolSelection"
              @submit="handleSchoolSelection"
              :initial-school="route.query.search"
              :dense="true"
              :horizontal="!smAndDown"
            />
          </div>

          <div class="search-label my-2 my-md-0 mx-0 mx-md-2" id="location-label">
            Location:
          </div>

          <div class="flex-grow-1 mr-0 mr-md-2">
            <SearchLocationInstitution
              ref="searchLocationRef"
              @search-update="handleLocationSelection"
              :initial-state="route.query.state ? route.query.state.split(',') : []"
              :initial-zip="route.query.zip"
              :initial-distance="route.query.distance"
              :horizontal="!smAndDown"
            />
          </div>

          <div class="d-flex flex-row-reverse mt-1 mt-md-0">
            <v-btn
              variant="outlined"
              class="mt-3 mt-md-0"
              @click="showSidebar = !showSidebar"
            >
              <v-icon size="small" class="pr-1" icon="fa:fas fa-sliders-h" />
              {{ showSidebar ? "Hide" : "Show" }} {{ smAndDown ? 'More' : '' }} Filters
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>


  <!-- the v-navigation-drawer doesn't want to behave so we need to devise a hand-rolled solution to the sidebar and main content layout -->
  <div class="d-flex flex-row position-relative">

    <!-- SIDEBAR -->
    <div 
      class="sidebar elevation-2 bg-white"
      :class="{
        'sidebar-open': showSidebar,
        'sidebar-closed': !showSidebar,
        'sidebar-mobile': smAndDown,
        'sidebar-desktop': !smAndDown
      }"
    >
      <div class="bg-white" v-show="showSidebar">
        <div class="pa-sm-0 pa-md-6 d-flex elevation-3">
          <h2 v-if="!smAndDown" class="flex-grow-1">More Filters</h2>
          <a href="#"class="float-right close-filter d-none d-md-block"@click="showSidebar = !showSidebar">
            <v-icon>mdi-chevron-left</v-icon>
            Close filters
          </a>
        </div>

        <!-- Search Form Component -->
        <SearchForm
          ref="searchFormRef"
          @search-update="handleFormSearch" 
          display-all-filters
          :hideLocation="true"
          :submittable="false"
        />
        <v-btn
          type="submit"
          :class="smAndDown ? 'mx-4 mt-4' : 'd-none'"
          color="secondary"
          size="large"
          v-show="false"
          @click="showSidebar = !showSidebar"
        >
          Find Schools
        </v-btn>
      </div>
    </div>

    <v-btn
      v-scroll="onScroll"
      v-show="showScroll"
      style="position: fixed; bottom: 20px; right: 20px; z-index: 900000"
      fab
      dark
      color="primary"
      @click="toTop"
      icon="fa:fas fa-arrow-up"
    />
    
    <!-- MAIN -->
    <div 
      class="flex-grow-1"       
      :class="{
        'sidebar-open-main': showSidebar,
        'sidebar-closed-main': !showSidebar,
        'sidebar-mobile-main': smAndDown,
        'sidebar-desktop-main': !smAndDown
      }">
      <div fluid class="pa-0">
        <div>
          <div :cols="showSidebar ? 6 : 9" xl="10" class="px-4 py-2 pa-sm-8`">

            <v-card class="mt-2 mb-2 px-4 elevation-0 d-flex align-center py-3 py-md-0 resultsNavCard">
              <div v-if="isLoading">
                  <h3 class="title">
                    Loading
                    <v-icon size="z-small" color="#00365e" icon="fa:fas fa-circle-notch fa-spin" class="ml-2"/>
                  </h3>
              </div>

              <div v-else class="w-100 h-100">

                <div class="d-flex flex-column align-start justify-space-between">
                  <div id="search-result-info-count">
                    <p class="title mb-0" style="font-size: 1.5rem;">
                      {{ results.meta.total }} Results
                    </p>
                  </div>

                  <Spacer :height="10" />

                  <div class="d-flex flex-column flex-md-row align-start align-md-center w-100">
                    <div class="d-flex flex-grow-1">
                      <!-- RESET FILTERS -->
                      <v-btn
                        id="search-button-clear"
                        @click="handleFormReset"
                        size="small"
                        elevation="3"
                        class="mr-1 mb-2"
                      >
                        <span>
                          <v-icon small class="mr-1">mdi-close-circle</v-icon>
                          Reset{{ smAndDown ? '' : " Filters" }}
                        </span>
                      </v-btn>

                      <!-- SORT -->
                      <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                          <v-btn
                            id="search-button-sort"
                            size="small"
                            class="mr-1 mb-2 searchbtn"
                            elevation="3"
                            v-bind="props"
                          >
                            <v-icon small class="mx-1" icon="fa:fas fa-sort" />
                            Sort{{ smAndDown ? '' : " :" }}
                            {{
                              smAndDown
                                ? ""
                                : sorts.find((el) => el.field === input.sort).type.split(" ")[0]
                            }}
                          </v-btn>
                        </template>
                        <v-list :min-width="200">
                          <v-list-item
                            v-for="(item, index) in sorts"
                            :key="item.field"
                            :value="item.field"
                            @click="handleSort(item.field)"
                            :active="item.field === input.sort"
                          >
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <!-- SHARE -->
                      <Share
                        :url="encodeURI(shareUrl)"
                        label="Share"
                        small
                        variant="text"
                        color="black"
                        :elevation="3"
                        :hide="['email']"
                        showCopy
                      />
                    </div>

                    <v-pagination
                      v-model="displayPage"
                      :length="totalPages"
                      @update:model-value="handlePagination"
                      :total-visible="paginatorPageCount"
                      active-color="primary"
                      variant="flat"
                    />
                  </div>


                </div>

              </div>
            </v-card>


              <!--  -->
              <!-- INSTITUTION INFORMATION -->
              <!--  -->
              <div
                v-if="!isLoading && displayFlag"
                id="search-institutions-dolflag"
                class="my-2"
              >
                <v-row>
                  <v-col cols="12" sm="6" md="6" class="">
                    <v-chip
                      class="dolflag-chip pa-3"
                      close
                      label
                      @click:close="handleDOLFlag"
                    >
                      <span>
                        Only show schools that have programs that qualify for
                        the Department of Labor's WIOA program.
                        <TooltipModal definition="wioa-participants"/>
                      </span>
                    </v-chip>
                  </v-col>

                  <v-col cols="12" sm="6" md="" class="">
                    <v-card outlined class="pa-3">
                      Learn more about the Department of Labor's WIOA program at 
                      <a target="_blank" href="https://collegescorecard.ed.gov/training"> CollegeScorecard.ed.gov/training.</a>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- No Results/Canned Search/ -->
              <div
                id="search-can-query-container"
                v-if="!isLoading && results.schools.length === 0"
              >
                <v-row>
                  <v-col cols="12">
                    <v-card outlined class="pa-5">
                      <h3>Show Me Options</h3>
                      <p class="mb-8">
                        Select one or more options below to create a list of
                        schools that fit your needs.
                      </p>
                      <SearchCannedContainer @canned-search-submit="handleCannedSearch" />
                    </v-card>
                    <Spacer :height="30" />
                  </v-col>
                </v-row>
              </div>

              <!-- Search Query Error-->
              <div class="show-error" v-if="error">
                <h1>Something went wrong:</h1>
                <p class="error-message">{{ error }}</p>
              </div>

              <!-- Institution Results -->
              <v-row class="mt-0">
                <v-col
                  v-for="school in results.schools"
                  :key="school.id"
                  cols="12"
                  :xl="showSidebar ? 3 : 2"
                  :lg="showSidebar ? 4 : 3"
                  :md="showSidebar ? 6 : 4"
                  sm="6"
                  xs="12"
                  class="d-flex align-stretch"
                >
                  <SearchResultCard :school="school" :isLoading="isLoading" />
                </v-col>
              </v-row>


              <!-- Bottom Pagination -->
              <div v-if="results.schools.length > 0">
                <Spacer :height="20" />
                <v-card class="mb-2 py-1 px-4 elevation-0" >
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12" class="v-pagination-wrapper pa-1" style="min-height: 50px;">
                        
                        <v-pagination
                          v-if="!isLoading"                      
                          v-model="displayPage"
                          :length="totalPages"
                          @update:model-value="handlePagination"
                          :total-visible="paginatorPageCount"
                          active-color="primary"
                          variant="flat"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </div>
              <div v-else-if="isLoading">
                <Spacer :height="1200" />
              </div>


            <!-- RESULTS CARD AND PAGINATION -->
            

          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
const route = useRoute()
const router = useRouter()
import { useDisplay } from "vuetify";
const { smAndDown, lgAndUp, md } = useBreakpoints()
const { prepareParams } = usePrepareParams()
const { apiGet } = useApi()
const { trackAnalyticsEvent } = useAnalytics()
const { site } = useSiteData()
const { fields } = useConstants()

definePageMeta({ 
  middleware: 'school-search',
})

const props = defineProps({
  pagePermalink: String,
  states: Array,
  programs: Array,
  religiousAffiliations: Array,
  specializedMission: Object,
  defaultSort: {
    type: String,
    default: "threshold_earnings:desc",
  },
  compareSchools: Array,
  compareFieldsOfStudy: Array,
})

const emit = defineEmits(['search-form-reset'])
const showSidebar = ref(!smAndDown.value)
const isLoading = ref(true)
const error = ref(null)
const showCompare = ref(false)
const shareUrl = ref(null)
const displayFlag = ref(route.query.dolflag === "true")
const displayPage = ref(1)
const showScroll = ref(false)

const searchFormRef = ref(null)
const searchSchoolRef = ref(null)
const searchLocationRef = ref(null)

const sorts = ref([
  { type: "Name", field: "name:asc" },
  { type: "Annual Cost", field: "avg_net_price:asc" },
  { type: "Graduation Rate", field: "completion_rate:desc" },
  { type: "% Earning More Than a High School Grad", field: "threshold_earnings:desc" },
])

const results = reactive({
  schools: [],
  meta: { total: 0 },
})

const input = reactive({
  sort: route.query.sort || props.defaultSort,
  page: route.query.page ? Number(route.query.page) + 1 : 1,
})


const totalPages = ref(0)
watch(() => results.meta, (meta) => {
  totalPages.value = Math.ceil(results.meta.total / results.meta.per_page)
})


// Computed properties
// 

const paginatorPageCount = computed(() => {
  if (smAndDown.value) { 
    return 2
  }

  if (md.value) {
    if (showSidebar.value) {
      return 1
    }
    return 4
  }

  if (lgAndUp.value) { return 5 }
  return null
})

// Methods
//
const searchAPI = async () => {
  try {
    isLoading.value = true
    error.value = null

    let params = prepareSearchParams()
    let query = buildQuery(params)
    let url = generateQueryString(params)
    router.replace(route.path + url)

    const response = await apiGet("/schools", query)
    isLoading.value = false
    results.schools = response.results
    results.meta = response.metadata
    shareUrl.value = window.location.href
    displayFlag.value = input.dolflag === "true"
  } catch (err) {
    console.warn("Error fetching search.", error)
    results.meta = {}
    results.schools = []
    if (error.response?.errors) {
      showError(error.response.errors[0])
    } else if (error.response?.status === 500) {
      showError("API 500 Error")
    }
  }
}

const showError = (errorMessage) => {
  console.error("error:", errorMessage)
  error.value = typeof errorMessage === 'string' ? errorMessage : "There was an unexpected API error."
}


const generateQueryString = (params) => {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params[key] !== null && params[key] !== undefined) {
      searchParams.append(key, params[key]);
    }
  }

  let qs = searchParams.toString()
  return "?" + qs.replace(/^&+/, "").replace(/&{2,}/g, "&").replace(/%3A/g, ":")
}

const prepareSearchParams = () => {
  const cleanedInput = Object.fromEntries(Object.entries(input).filter(([_, v]) => v != null))
  let params = {
    ...cleanedInput,
    page: input.page ? input.page - 1 : 0,
    sort: input.sort || props.defaultSort
  }

  if (params.state) {
    if (Object.keys(params.state).length === 0) {
      delete params.state
    }
  }

  if (params.size) {
    if (Object.keys(params.size).length === 0) {
      delete params.size
    }
  }

  if (params.distance) {
    if ((!params.lat && !params.long) && !params.zip) {
      delete params.distance
    }
  }

  return params
}

const buildQuery = (params) => {
  const query = prepareParams(params)
  query.fields = [
    fields.ID,
    fields.NAME,
    fields.CITY,
    fields.STATE,
    fields.SIZE,
    fields.BRANCHES,
    fields.LOCALE,
    fields.OWNERSHIP, // to get "public" or "private"
    fields.PREDOMINANT_DEGREE, // to get the "four_year" or "lt_four_year" bit
    fields.PROGRAM_REPORTER_OFFERED, // program-reporter offered programs / flag
    fields.NET_PRICE, // get all of the net price values
    fields.COMPLETION_RATE, // completion rate
    fields.MEDIAN_EARNINGS, // this has no sub-fields
    fields.EARNINGS_GT_25K, // not sure if we need this, but let's get it anyway
    fields.UNDER_INVESTIGATION, // under investigation flag
    fields.COMPLETION_OM, // new completion rates
    fields.COMPLETION_150_4, // new completion rates
    fields.COMPLETION_150_LT4, // new completion rates
    fields.FIELD_OF_STUDY,
  ].join(",")

  query.all_programs_nested = true
  delete query.toggle
  return query
}


const handleDOLFlag = () => {
  debounceSearch()
}

// SEARCH EVENT HANDLERS
//
//
const handleFormSearch = (params) => {
  const updateParams ={
    id: params.id,
    major: params.major,
    size: params.size,
    name: params.name,
    control: params.control,
    serving: params.serving,
    religious: params.religious,
    completion_rate: params.completion_rate,
    avg_net_price: params.avg_net_price,
    urban: params.urban,
    cip4: params.cip4,
    cip4_degree: params.cip4_degree,
    act: params.act,
    sat_math: params.sat_math,
    sat_read: params.sat_read,
    acceptance: params.acceptance,
    locale: params.locale,
    search: params.search,
    dolflag: params.dolflag,
  }

  Object.keys(updateParams).forEach(key => {
    if (updateParams[key] === null || updateParams[key] === undefined) {
      delete input[key]
      delete updateParams[key]
    }
  })
  
  Object.assign(input, { ...updateParams, page: 1 })

  if (params.zip || params.state || params.distance || params.lat || params.long) {
    return handleLocationSelection(params)
  }

  debounceSearch(params)
}

const handleSchoolSelection = (school) => {
  input.search = typeof school === "string" ? school : school["school.name"]
  input.page = 1
  debounceSearch()
}

const handleLocationSelection = (params) => {
  const updateParams = {
    state: params.state,
    zip: params.zip,
    distance: params.distance,
    lat: params.lat,
    long: params.long,
  }

  Object.keys(updateParams).forEach(key => {
    if (updateParams[key] === null || updateParams[key] === undefined) {
      delete input[key]
      delete updateParams[key]
    }
  })

  Object.assign(input, { ...updateParams, page: 1 })
  debounceSearch()
}

const handleCannedSearch = (params) => {
  Object.keys(input).forEach((key) => delete input[key])
  searchFormRef.value.resetForm()
  searchLocationRef.value.resetForm()
  searchSchoolRef.value.resetForm()

  if (params.state) input.state = params.state
  if (params.cip4_degree) input.cip4_degree = params.cip4_degree
  if (params.completion_rate) input.completion_rate = params.completion_rate
  if (params.acceptance) input.acceptance = params.acceptance
  if (params.lat) input.lat = params.lat
  if (params.long) input.long = params.long

  input.page = 1
  input.sort = props.defaultSort

  searchFormRef.value.mapInputFromQuery(input)
  searchFormRef.value.autoOpenActivePanels(true)
  debounceSearch()
}

const handlePagination = (page) => {
  input.page = page
  searchAPI()
  toTop()
}

const handleSort = (sort) => {
  input.sort = sort
  debounceSearch()
}

const handleFormReset = () => {
  Object.keys(input).forEach((key) => delete input[key])
  input.sort = props.defaultSort
  input.page = 1
  searchFormRef.value.resetForm()
  searchLocationRef.value.resetForm()
  searchSchoolRef.value.resetForm()
}

// ON LOAD, DEBOUNCER, AND HELPERS
// 
//
const debounceSearch = useDebounce(() => {
  searchAPI()
}, 300)

const onScroll = (e) => {
  if (typeof window === "undefined") return
  const top = window.scrollY || e.target.scrollTop || 0
  showScroll.value = top > 20
}

const toTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

useHead({
  title: "Search Schools",
  meta: [
    {
      key: "og:title",
      name: "og:title",
      content: "Search | College Scorecard",
    },
    {
      key: "twitter:title",
      name: "twitter:title",
      content: "Search | College Scorecard",
    },
    {
      name: 'description',
      content: 'Search colleges nationwide. Search for schools based on degree type, cost, school type, test scores, size, mission, afflication, and more.'
    },
    {
      name: 'keywords',
      content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, tutition costs, graduation rates, median earnings, acceptance rate, school size, WIOA'
    }
  ],
})
</script>
