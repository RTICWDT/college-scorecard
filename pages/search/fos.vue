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
    min-width: 340px;
    max-width: 340px;
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
  flex-grow: 1;
  z-index: 1000;
}

.sidebar-open-main {}
.sidebar-closed-main {}
.sidebar-mobile-main.sidebar-open-main { display: none; }
.sidebar-desktop-main {}
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

.fosResultsSortBar {
  a {
    opacity: 1;
    transition: opacity 0.3s;
  }
}

.fosResultsSortBar.loading {
  a {
    opacity: 0.3;
  }
}


.searchHeaderCompact {
  @include md {
    position: relative;
    // left: -15px;
    padding-right: 20px;
  }
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
          <h1>Search Fields of Study</h1>
          <p>
            Search and compare the fields of study offered at each college by degree type.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- SEARCH BAR -->
  <v-container fluid class="elevation-2 bg-white" style="z-index: 50; position: relative;">
    <v-row>
      <v-col class="px-0 py-0">
        <v-card flat class="white d-flex flex-column flex-md-row align-md-center border-none px-3 pb-2 pt-0 pt-md-2">
          <div class="search-label my-2 my-md-0 mr-0 mr-md-2">Field of Study:</div>

          <div style="min-width: 200px">
            <SearchFieldOfStudy
              v-model="fosSearch.cip4"
              :dense="true"
            />
          </div>

          <div class="search-label my-2 my-md-0 mx-0 mx-md-2" id="location-label">
            Degree Type:
          </div>

          <div class="flex-grow-1 mr-0 mr-md-2">
            <v-select
              v-model="input.cip4_degree"
              @update:model-value="handleDegreeSelected"
              :items="fosDegrees"
              item-title="label"
              item-value="value"
              variant="outlined"
              placeholder="Select one"
              hide-details
              id="fosDegree"
              color="#007000"
              aria-required="true"
              density="compact"
              :max-width="smAndDown ? null : 400"
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
        <div class="pa-1 pa-md-6 d-flex elevation-3">
          <h2 class="flex-grow-1 d-none d-md-block">More Filters</h2>
          <a href="#"class="float-right close-filter d-none d-md-block"@click="showSidebar = !showSidebar">
            <v-icon>mdi-chevron-left</v-icon>
            Close filters
          </a>
        </div>

        <!-- Search Form Component -->
        <SearchFieldOfStudyForm
          ref="searchFormRef"
          @search-update="handleFormSearch"
        />
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
          <div class='d-flex flex-md-row flex-column align-md-center align-start mb-md-0 mb-5'>
            <div>
              <h2 class="my-4 pl-2"><span class="mr-3">{{ selectedFoSLabel }}</span></h2>
            </div>
            <div>
              <v-chip
                class="font-weight-bold text-uppercase"
                color="black"
              >
                {{ selectedFoSDegree }}
              </v-chip>
            </div>
          </div>

          <v-card class="mt-2 mb-2 px-4 elevation-0 d-flex align-center py-3 py-md-0 resultsNavCard">
            <div v-if="isLoading">
              <h3 class="title" style="font-size: 1.5rem;">
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
                  <div class="d-flex flex-column flex-sm-row pb-4 pb-sm-0 flex-grow-1">
                    <!-- RESET FILTERS -->
                    <v-btn
                      id="search-button-clear"
                      @click="handleFormReset"
                      size="small"
                      elevation="4"
                      class="mr-1 mb-2"
                    >
                      <span>
                        <v-icon small class="mr-1">mdi-close-circle</v-icon>
                        Reset Filters
                      </span>
                    </v-btn>

                    <!-- SORT -->
                    <v-menu offset-y v-if="smAndDown">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          id="search-button-sort"
                          size="small"
                          class="mr-1 mb-2"
                          elevation="2"
                          v-bind="props"
                        >
                          <v-icon small class="mr-1 ml-n1" icon="fa:fas fa-sort" />
                          {{
                            (() => {
                              const sortField = input.sort.split(':')[0];
                              const sortInfo = sorts.find((el) => el.field === sortField);
                              return sortInfo 
                                ? `${sortInfo.type} ${sortInfo.direction}`
                                : '';
                            })()
                          }}
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

                    <!-- SHARE -->
                    <Share
                      :url="shareLink"
                      label="Share"
                      variant="text"
                      color="black"
                      :elevation="3"
                      :hide="['email']"
                      show-copy
                    />
                  </div>

                  <v-pagination 
                    v-model="displayPage"
                    :length="totalPages"
                    :total-visible="paginatorPageCount"
                    @update:model-value="handlePaginationInput"
                    active-color="primary"
                    variant="flat"
                  />
                </div>
              </div>
            </div>
          </v-card>
              

              <!--  -->
              <!-- FOS INFORMATION -->
              <!--  -->

              <!-- Field Of Study CIP 4 Information -->
              <div>
                <v-row>
                  <v-col cols="12">
                    <v-alert color="white" class="pl-5">
                      <strong>Note:</strong> Field of Study titles are based
                      on the US Department of Education's Classification of
                      Instructional Programs (CIP) and may not match the
                      program titles at a given school.
                      <a
                        target="_blank"
                        href="https://nces.ed.gov/ipeds/cipcode/Default.aspx?y=56"
                        @click="analytics.transitionOutboundLink($event)"
                      >
                        Learn more about CIP
                        <v-icon size="x-small">mdi-open-in-new</v-icon>
                      </a>
                    </v-alert>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" class="pt-0" v-if="input.dolflag">
                    <v-alert
                      border="start"
                      color="white"
                      border-color="primary"
                      class="mb-0"
                    >
                      <span>
                        Only show schools that have programs that qualify for
                        the Department of Labor's WIOA program.
                        <TooltipModal definition="wioa-participants" />
                      </span>
                    </v-alert>
                  </v-col>
                </v-row>
              </div>

              <!-- No Results/Canned Search/ -->
              <div
                id="search-can-query-container"
                v-if="!isLoading && results.fieldsOfStudy.length === 0"
              >
                <v-row>
                  <v-col cols="12">
                    <v-card class="pa-5 text-center elevation-0">
                      <h3 class="text-center">No Results Found</h3>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- Main Search Results -->
              <div class="results-main-alert">

                <!-- Search Query Error-->
                <div class="show-error" v-show="error">
                  <h1>Something went wrong:</h1>
                  <p class="error-message">{{ error }}</p>
                </div>

                <!-- Field of Study Results -->
                <div
                  class="search-result-cards-container"
                  v-if="results.fieldsOfStudy.length > 0"
                >
                  <v-card class="mt-3">
                    <v-card-text>
                      <v-row
                        class="mb-2 py-4"
                        :class="showSidebar && 'searchHeaderCompact'"
                        style="border-bottom:2px solid #eee"
                        v-if="!smAndDown"
                      > 
                        <v-col
                          class="fosResultsSortBar py-md-0 pl-5"
                          :class="isLoading && 'loading'"
                          cols="12"
                          v-for="sort in sorts"
                          :key="sort.type"
                          :sm="sort.type === 'School Name' ? 4 : sort.type === 'Graduates' ? 2 : 3"
                        >
                          <v-btn
                            @click="(e) => changeSort(e, sort.type)"
                            :active="sort.current"
                            :color="!sort.current ? 'blue' : 'gray'"
                            variant="text"
                            class="position"
                            density="compact"
                          >
                            {{ sort.type }}
                            <v-icon size="large" aria-hidden>
                              {{
                                (() => {
                                  return sort.current ? (sort.direction === 'asc' ? 'mdi:mdi-menu-up' : 'mdi:mdi-menu-down') : 'mdi:mdi-menu-swap';
                                })()
                              }}
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>

                      <!-- Fields of Study Results -->
                      <v-row>
                        <v-col
                          v-for="fieldOfStudy in results.fieldsOfStudy"
                          :key="fieldOfStudy.unit_id"
                          cols="12"
                          class="pl-5 position-relative"
                        >
                          <SearchFieldOfStudyResultCard :fos="fieldOfStudy" :isLoading="isLoading" :showSidebar="showSidebar" />
                          <v-row>
                            <v-col class='py-0'>
                              <hr />
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>

              <!-- Bottom Pagination -->
              <div v-if="results.fieldsOfStudy.length > 0">
                <Spacer :height="20" />
                <v-card class="mb-2 py-1 px-4 elevation-0" >
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12" class="v-pagination-wrapper pa-1" style="min-height: 50px;">
                        
                        <v-pagination
                          v-if="!isLoading"                      
                          v-model="displayPage"
                          :length="totalPages"
                          @update:model-value="handlePaginationInput"
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
                <Spacer :height="700" />
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
const { smAndDown, lgAndUp, md, xs } = useBreakpoints()
const { prepareParams } = usePrepareParams()
const { site } = useSiteData()
const { formMappings } = useConstants();
const { apiGet } = useApi()
const router = useRouter()
const route = useRoute()
const isLoading = ref(true)
const showSidebar = ref(!smAndDown.value)
const error = ref(null)
const displayPage = ref(1)
const showScroll = ref(false)
const defaultSort =  ref("name:asc")
const shareUrl = ref(null)
const emit = defineEmits(["search-form-reset", "loading"])
const searchFormRef = ref(null)

// this runs pre-render and allows us to redirect
// to fos-landing if we don't have the necessary parameters
definePageMeta({
  middleware: 'fos'
})

const results = reactive({
  fieldsOfStudy: [],
  meta: { total: 0 },
})

const input = reactive({
  sort: route.query.sort || defaultSort.value,
  page: route.query.page || 1,
  cip4: route.query.cip4.substring(0,4) || null,
  cip4_degree: route.query.cip4_degree || null,
  dolflag: route.query.dolflag || false,
})

const sorts = ref([
  {
    type: "School Name",
    field: "name",
    current: true,
    direction: "asc",
  },
  {
    type: "Earnings",
    field:
      "fos_median_earnings",
    current: false,
    direction: "asc",
  },
  {
    type: "Debt",
    field:
      "fos_debt",
    current: false,
    direction: "asc",
  },
  {
    type: "Graduates",
    field: "fos_graduates",
    current: false,
    direction: "asc",
  },
])

// COMPUTED
const paginatorPageCount = computed(() => {
  if (xs.value) { return 1 }
  if (smAndDown.value) { return 2 }

  if (md.value) {
    if (showSidebar.value) { return 1 }
    return 4
  }

  if (lgAndUp.value) { return 5 }
  return null
})

const selectedFoSLabel = computed(() => {
  if (input.cip4) {
    return useFind(site.value.data.cip_4_digit, [
      "label",
      input.cip4.substring(0, 2) + "." + input.cip4.substring(2,4),
    ])["value"].replace(".", "")
  } else {
    return ""
  }
})

const selectedFoSDegree = computed(() => {
  if (input.cip4_degree) {
    let degree = formMappings.fosDegrees.find((itm) => {
      return itm.value == input.cip4_degree
    })
    return degree.label
  } else {
    return ""
  }
})

const totalPages = ref(0)
watch(() => results.meta, (meta) => {
  totalPages.value = Math.ceil(results.meta.total / results.meta.per_page)
})

const fosDegrees = computed(() => formMappings.fosDegrees)

// METHODS
const searchAPI = async () => {
  try {
    isLoading.value = true
    error.value = null

    let params = prepareSearchParams()
    let query = prepareParams(params)
    let url = generateQueryString(params)

    // console.log("SEARCHING API WITH: ", input)
    // console.log("QUERY: ", query)
    // console.log("URL: ", url)

    router.replace(route.path + url)

    const response = await apiGet("/fos", query)

    isLoading.value = false
    results.fieldsOfStudy = response.results
    results.meta = response.metadata
    shareUrl.value = window.location.href
  } catch (err) {
    isLoading.value = false
    console.warn("Error fetching search.", err)

    results.meta = { total: 0 }
    results.fieldsOfStudy = []

    if (err.message === "Request aborted") {
      // Do nothing for aborted requests
    } else if (err.response?.data?.errors) {
      showError(err.response.data.errors[0])
    } else if (err.response?.status === 500) {
      showError("API 500 Error")
    }
  }
}

const prepareSearchParams = () => {
  const cleanedInput = Object.fromEntries(Object.entries(input).filter(([_, v]) => v != null))
  return {
    ...cleanedInput,
    page: input.page ? input.page - 1 : 0,
    sort: input.sort || defaultSort.value
  }
}

const showError = (error) => {
  console.error("error:", error)
  if (error.message) {
    error.value = error.message
  } else {
    console.log(error)
  }
}

const handlePaginationInput = (page) => {
  input.page = page
  searchAPI()
  toTop()
}
    
const resort = (sort) => {
  input.page = 1
  input.sort = sort
  searchAPI()
}
    
const changeSort = (event, selected) => {
  event.preventDefault()

  sorts.value.map((itm) => {
    if (itm.type == selected) {
      itm.current = true
      itm.direction = itm.direction == "asc" ? "desc" : "asc"
      input.sort = `${itm.field}:${itm.direction}`
    } else {
      itm.current = false
    }
  })

  input.page = 0
  debounceSearch()
}

const onScroll = (e) => {
  if (typeof window === "undefined") return
  const top = window.pageYOffset || e.target.scrollTop || 0
  showScroll.value = top > 20
}

const toTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const generateQueryString = (params) => {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params[key] !== null && params[key] !== undefined && params[key] !== false) {
      searchParams.append(key, params[key]);
    }
  }

  let qs = searchParams.toString()
  return "?" + qs.replace(/^&+/, "").replace(/&{2,}/g, "&").replace(/%3A/g, ":")
}

const handleFormSearch = (params) => {
  const updateParams = {
    fos_debt: params.fos_debt,
    fos_salary: params.fos_salary,
    lat: params.lat,
    long: params.long,
    zip: params.zip,
    state: params.state,
    distance: params.distance,
    dolflag: params.dolflag,
  }

  Object.keys(updateParams).forEach(key => {
    if (updateParams[key] === null || updateParams[key] === undefined) {
      delete input[key]
      delete updateParams[key]
    }

    let array = isArray(updateParams[key])
    if (array && updateParams[key].length === 0) {
      delete input[key]
      delete updateParams[key]
    } 
  })
  
  Object.assign(input, { ...updateParams, page: 1 })
  debounceSearch()
}

const fosSearch = reactive({
  cip4: (() => {
    const item = site.value.data.cip_6_digit.find((item) => {
      if (route.query.cip4.length === 4) {
        return item.code.substring(0,4) === route.query.cip4
      }

      return item.code === route.query.cip4
    })

    if (item) { 
      item.code = item.code.substring(0, 4)
    }
    
    return item
  })(),
})

watch(fosSearch, (newValue, oldValue) => {
  if (fosSearch.cip4?.code) {
    fosSearch.cip4.code = fosSearch.cip4.code.substring(0, 4)
    input.page = 1
    input.cip4 = fosSearch.cip4.code
    debounceSearch()
  }
})

const handleDegreeSelected = (degree) => {
  input.page = 1
  input.cip4_degree = degree
  debounceSearch()
}

const handleFormReset = () => {
  searchFormRef.value.resetForm()
  input.sort = defaultSort.value
  input.page = 1
}

const debounceSearch = useDebounce(function() {
  searchAPI()
}, 300)

const shareLink = computed(() => {
  const currentPath = route.fullPath
  const url = useRequestURL()
  const fullUrl = `${url.origin}${currentPath}`
  return encodeURI(fullUrl) || null
})

useHead({
  title: "Search Fields of Study",
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
      content: 'Search the fields of study offered at each school by degree type.  Fields of study are areas of academic concentration (e.g, major sor programs).'
    },
    {
      name: 'keywords',
      content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings; field of study, program, major, CIP, Classification of Instructional Programs, salary after completing, median total debt, WIOA'
    }
  ],
})
</script>