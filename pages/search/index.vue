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

.container--fluid {
  max-width: none !important;
}

.tab-card {
  border: none;
}

.transparent {
  background:transparent !important;
}
.bg-white {
  background:white !important;
}
</style>

<template>
  <div>
    <v-main>
      <v-card tile class="tab-card">
        <!-- <search-tabs :selected="0" /> -->
      </v-card>
      <div class="bg-blue">
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
      <v-container
        fluid
        class="white elevation-2"
        style="z-index:50; position:relative"
      >
        <v-row>
          <v-col>
            <v-card flat class="white d-sm-flex align-center">
              <div class="mx-1 mx-sm-3 search-label">School:</div>
              <SearchNameAutocomplete
                @school-name-selected="handleSchoolNameSelected"
                :initial_school="input.search"
                @school-name-cleared="handleSchoolNameSelected"
                :dense="true"
              />

              <div
                class="mx-1 mx-sm-3 mt-3 my-sm-0  search-label"
                id="location-label"
              >
                Location:
              </div>
              <SearchLocationInstitution
                @search-query="handleLocationSelection"
                :initial_state="input.state"
                :initial_zip="input.zip"
                :initial_distance="input.distance"
                :horizontal="true"
              />
              <v-btn
                outlined
                class="ml-sm-auto mx-sm-3 my-3 my-sm-0 float-right float-sm-none toggle-sidebar"
                @click="showSidebar = !showSidebar"
              >
                <v-icon small class="pr-1">fas fa-sliders-h</v-icon>
                {{ showSidebar ? "Hide" : "Show" }} Filters
              </v-btn>
            </v-card>
          </v-col></v-row
        >
      </v-container>


      <v-container fluid class="pa-0">
        <v-row>
          <v-col
            cols="3"
            xl="2"
            :class="{ 'd-none': !showSidebar }"
            class="pr-0"
          >
            <v-navigation-drawer
              v-model="showSidebar"
              :width="smAndDown ? '100%' : 'auto'"
              :absolute="smAndDown"
              :temporary="smAndDown"
              hide-overlay
            >
              <div class="pa-6 bg-white">
                <a
                  href=""
                  class="float-right close-filter"
                  @click="showSidebar = !showSidebar"
                >
                  &lt; Close filters</a
                >
                <h2>
                  More Filters
                </h2>
              </div>
              <!-- Search Form Component -->
              <SearchForm
                :urlParsedParams="urlParsedParams"
                auto-submit
                display-all-filters
                @search-query="handleInstitutionSearch"
                :hideLocation="true"
              />
              <v-btn
                type="submit"
                :class="smAndDown ? 'mx-4 mt-4' : 'd-none'"
                color="secondary"
                large
                v-show="false"
                @click="showSidebar = !showSidebar"
                >Find Schools</v-btn
              >
            </v-navigation-drawer>
            <v-btn
              v-scroll="onScroll"
              v-show="btt"
              fab
              dark
              fixed
              bottom
              right
              color="primary"
              @click="toTop"
              style="z-index:1000"
            >
              <v-icon>fas fa-arrow-up</v-icon>
            </v-btn>
            </v-col>
            <v-col :cols="showSidebar ? 9 : 12" xl="10" class="pa-6 pa-sm-8`">
            <div id="search-result-container">
              <div class="search-result-container">
                <!-- Search Result Info and controls -->
                <v-card
                  class="mt-2 mb-4 py-4 px-4 elevation-0 pageBar"
                  v-show="!isLoading"
                >
                  <v-row class="">
                    <v-col cols="12" sm="8" class="py-2 px-4">
                      <div id="search-result-info-count" class>
                        <p class="title mb-0">
                          {{ results.meta.total }} Results
                          <br class="d-block" />
                          <v-btn
                            id="search-button-clear"
                            @click="clearSearchForm"
                            small
                            outlined
                            class="mr-3 mb-1 mb-sm-0 searchbtn"
                            elevation="1"
                          >
                            <span>
                              <v-icon small class="mr-1"
                                >mdi-close-circle</v-icon
                              >
                              Reset Filters
                            </span>
                          </v-btn>
                          <br class="d-block d-sm-none" />

                          <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                id="search-button-sort"
                                small
                                outlined
                                class="mr-3 mb-1 mb-sm-0 searchbtn"
                                elevation="1"
                              >
                                <v-icon small class="mx-1" icon="fa:fas fa-sort"></v-icon>
                                Sort:
                                <!-- {{
                                  sorts.find((el) => el.field === input.sort).type
                                }} -->
                              </v-btn>
                            </template>
                            <v-list :min-width="200">
                              <v-list-item
                                v-for="(item, index) in sorts"
                                :key="item.field"
                                :value="item.field"
                                @click="resort(item.field)"
                              >
                                <v-list-item-title>{{ item.type }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                          <br class="d-block d-sm-none" />
                          <!-- <share
                            :url="encodeURI(shareUrl)"
                            label="Share"
                            small
                            show-copy
                            :hide="['email']"
                            color="#eff1f5"
                            class="mr-3 mb-1 mb-sm-0 "
                          /> -->
                        </p>
                      </div>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="4"
                      class="py-1 px-1"
                      v-show="!isLoading && results.schools.length > 0"
                    >
                      <div class="d-block text-right">
                        <v-pagination
                          v-model="displayPage"
                          :length="totalPages"
                          :total-visible="7"
                          @input="handlePaginationInput"
                          class="pr-0 mr-0 justify-end text-right ml-1"
                        ></v-pagination>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Instituition Information -->
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
                        ><span
                          >Only show schools that have programs that qualify for
                          the Department of Labor's WIOA program.<tooltip
                            definition="wioa-participants"/></span
                      ></v-chip>
                    </v-col>
                    <v-col cols="12" sm="6" md="" class="">
                      <v-card outlined class="pa-3">
                        Learn more about the Department of Labor's WIOA program
                        at
                        <a
                          target="_blank"
                          href="https://collegescorecard.ed.gov/training"
                        >
                          CollegeScorecard.ed.gov/training.
                        </a>
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
                        <p>
                          Select one or more options below to create a list of
                          schools that fit your needs.
                        </p>
                        <SearchCannedContainer @canned-search-submit="handleCannedSearchClick" />
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Main Search Results -->
                <div class="results-main-alert">
                  <!-- Loading -->
                  <div class="show-loading mt-2" v-show="isLoading">
                    <v-card class="py-4 px-4 pageBar elevation-0">
                      <h1 class="title">
                        Loading
                        <v-icon color="#00365e"
                          >fas fa-circle-notch fa-spin</v-icon
                        >
                      </h1>
                    </v-card>
                  </div>

                  <!-- Search Query Error-->
                  <div class="show-error" v-show="error">
                    <h1>Something went wrong:</h1>
                    <p class="error-message">{{ error }}</p>
                  </div>

                  <!-- Institution Results -->
                  <div class="search-result-cards-container" v-if="!isLoading">
                    <v-row>
                      <v-col
                        v-for="school in results.schools"
                        :key="school.id"
                        cols="12"
                        xl="2"
                        lg="3"
                        md="4"
                        sm="6"
                        class="d-flex align-stretch"
                      >
                        <!-- <search-result-card :school="school" /> -->
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Field of Study Results -->
                  <div class="search-result-cards-container" v-else></div>
                </div>

                <!-- Bottom Pagination -->
                <v-card
                  class="mt-4 mb-2 py-1 px-4 pageBar elevation-0"
                  v-if="!isLoading && results.schools.length > 0"
                >
                  <v-row>
                    <v-col cols="12" class="py-3 px-3">
                      <div class="text-left text-sm-right">
                        <v-pagination
                          v-model="displayPage"
                          :length="totalPages"
                          :total-visible="7"
                          @input="handlePaginationInput"
                          class="pr-0 mr-0"
                        ></v-pagination>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!--End of root -->
  </div>
</template>


<script setup>
const route = useRoute()
const router = useRouter()
import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay()
const { addURLToStorage } = useUrlHistory()
const { prepareParams } = usePrepareParams()
const { trackAnalyticsEvent } = useAnalytics()
const { getSiteData } = useSiteData()

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
  isLoading: Boolean,
  compareSchools: Array,
  compareFieldsOfStudy: Array,
})

const emit = defineEmits(['loading', 'search-form-reset', 'reset-dol-flag'])
const showSidebar = ref(false)
const sidebar = reactive({ fixed: false, absolute: true })
const results = reactive({
  schools: [],
  meta: { total: 0 },
})

const input = reactive({
  sort: null,
  page: 1,
})

const urlParsedParams = ref({})

const utility = reactive({
  formDefault: {},
  initialized: false,
  sortFAB: null,
  previousParams: {},
  rules: {
    required: (value) => !!value || "Required.",
    numerical: (value) => /^\d+$/.test(value) || "Numerical",
  },
  enable: {
    completion_rate: false,
    avg_net_price: false,
    sat_math: false,
    sat_read: false,
    act: false,
    acceptance: false,
  },
  showMore: false,
})

const error = ref(null)
const showCompare = ref(false)

const sorts = [
  { type: "Name", field: "name:asc" },
  { type: "Annual Cost", field: "avg_net_price:asc" },
  { type: "Graduation Rate", field: "completion_rate:desc" },
  { type: "% Earning More Than a High School Grad", field: "threshold_earnings:desc" },
]

const shareUrl = ref(null)
const fieldOfStudyTotalCountWithoutRangeFilters = ref(0)
const displayFlag = ref(false)
const displayPage = ref(1)
const btt = ref(false)

// Computed properties
const totalPages = computed(() => {
  if (results.meta.per_page && results.meta.total) {
    return Math.ceil(results.meta.total / results.meta.per_page)
  }
})

// Methods
const parseURLParams = (url) => {
  if (!url && process.client) {
    url = location.search.substr(1)
  }
  return route.query;
}

const generateQueryString = (params) => {
  let qs = querystring.stringify(params)
  return "?" + qs.replace(/^&+/, "").replace(/&{2,}/g, "&").replace(/%3A/g, ":")
}

const searchAPI = async () => {
  const cleanedInput = Object.fromEntries(Object.entries(input).filter(([_, v]) => v != null))
  let params = { ...cleanedInput }

  emit("loading", true)
  error.value = null
  displayFlag.value = params.dolflag === "true"

  params.page = input.page ? input.page - 1 : 0
  params.sort = input.sort || props.defaultSort

  let query = prepareParams(params)
  query.fields = [
    // Add your fields here
  ].join(",")

  if (query.toggle) delete query.toggle
  query.all_programs_nested = true

  let qs = generateQueryString({ ...params })
  if (process.client) {
    history.replaceState(params, "search", qs)
  }
  addURLToStorage(qs)

  try {
    const response = await apiGet("/schools", query)
    results.schools = response.data.results
    results.meta = response.data.metadata
    emit("loading", false)
    shareUrl.value = window.location.href
    showSidebar.value = !smAndDown
  } catch (error) {
    console.warn("Error fetching search.")
    emit("loading", false)
    results.meta = {}
    results.schools = []
    if (error.response?.data?.errors) {
      showError(error.response.data.errors[0])
    } else if (error.response?.status === 500) {
      showError("API 500 Error")
    }
  }
}

const showError = (errorMessage) => {
  console.error("error:", errorMessage)
  error.value = typeof errorMessage === 'string' ? errorMessage : "There was an unexpected API error."
}

const resort = (sort) => {
  input.sort = sort
  const params = parseURLParams()
  params.sort = input.sort
  debounceSearchUpdate(params)
}

const clearSearchForm = () => {
  Object.assign(input, { page: 1, sort: props.defaultSort })
  urlParsedParams.value = {}
  emit("search-form-reset")
}

const handleInstitutionSearch = (params) => {
  Object.assign(input, { ...params, page: 1 })
  searchAPI()
}

const handleCannedSearchClick = (cannedSearchData) => {
  Object.assign(input, { ...cannedSearchData, page: 1 })
  searchAPI()
  urlParsedParams.value = parseURLParams()
}

const handleLocationSelection = (params) => {
  Object.assign(input, { ...params, page: 1 })
  searchAPI()
}

const handlePaginationInput = (page) => {
  input.page = page
  searchAPI()
  toTop()
}

const handleDOLFlag = () => {
  urlParsedParams.value = parseURLParams()
  delete urlParsedParams.value.dolflag
  debounceSearchUpdate(urlParsedParams.value)
  emit("reset-dol-flag")
}

const handleSchoolNameSelected = (school) => {
  input.search = typeof school === "string" ? school : school["school.name"]
  input.page = 1
  searchAPI()
}

const onScroll = (e) => {
  if (typeof window === "undefined") return
  const top = window.pageYOffset || e.target.scrollTop || 0
  btt.value = top > 20
}

const toTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

onMounted(() => {
  utility.formDefault = useCloneDeep(input)
  urlParsedParams.value = parseURLParams()

  showSidebar.value = !smAndDown

  input.sort = urlParsedParams.value.sort || props.defaultSort
  input.page = urlParsedParams.value.page ? Number(urlParsedParams.value.page) + 1 : 1

  displayFlag.value = urlParsedParams.value.dolflag === "true"
})

// Debounced function
const debounceSearchUpdate = useDebounce((params) => {
  handleInstitutionSearch(params)
}, 1000)

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
