<template>
  <div class="d-flex w-100 h-100 align-center justify-content-center" v-if="loading || (!school.id && !error)">
    <div class="show-loading w-100">
      <h1 class="title text-center mt-15">
        <v-icon size="x-small" class="mr-2 position-relative" style="bottom: 2px;" color="primary-blue" icon="fa:fas fa-circle-notch fa-spin"/>
        Loading
      </h1>
    </div>
  </div>

  <v-container class="mt-5" v-else-if="error">
    <v-row>
        <v-col cols="12" lg="12" class="">
          <div>
            <v-card class="pa-5" elevation="0">
              <h2>Something went wrong</h2>
              <p>Try searching for a school by name:</p>
              <SearchSchoolAutocomplete
                @school-name-selected="handleSchoolNameSelected"
                :searchEmptyName="false"
              />
            </v-card>
          </div>
        </v-col>
      </v-row>
  </v-container>

  <div v-else>

      <!--Top Control Row-->
      <div class="bg-primary-aqua">
        <v-container class="pt-5 pb-6">
          <v-row>
            <v-col class="pa-0 text-right d-flex align-center justify-sm-end justify-space-evenly">
              <v-btn
                size="small"
                color="primary-aqua"
                id="referrer-link"
                class="link-more pl-1 pr-2"
                @click="$router.back()"
              >
                &laquo; Back
              </v-btn>

              <div class="flex-grow-1" />
              <SchoolAddToCompare :school="school" />

              <Share
                variant="outlined"
                color="white"
                :elevation="0"
                label="Share this School Search"
                :url="shareLink"
                show-copy
                :hide="['email']"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Institution Summary Container-->
      <v-container class="pb-10">
        <v-row class="pt-5">

          <!-- School Information and Icons-->
          <v-col cols="12" md="5">
            <v-chip v-if="underInvestigation == 1" color="error" label>
              <strong>Under ED Monitoring</strong>
              &nbsp;
              <TooltipModal
                definition="hcm2"
                color="white"
                class="ml-2"
                :isBranch="isBranch"
              />
            </v-chip>
            <h1
              id="profile-institution-title"
              class="small-display-3 font-weight-bold pa-0 mb-4"
              v-if="breakpoints.smAndDown.value"
            >
              {{ schoolName }}
            </h1>
            <h1
              id="profile-institution-title"
              class="display-3 font-weight-bold pa-0 mb-4"
              style="line-height: 48px !important;"
              v-else
            >
              {{ schoolName }}
            </h1>            
            <div class="population my-1">
              <span class="font-weight-bold">{{ toNumber(undergraduates) }}</span>
              undergraduate students
            </div>
            <div class="school-url my-1">
              <a
                target="_blank"
                :href="schoolUrl"
                @click="analytics.transitionOutboundLink($event)"
              >
              {{  formatUrlText(schoolUrlDisplay) }}
              <v-icon size="x-small" class="pl-1" color="primary-green">mdi-open-in-new</v-icon>
              </a>
            </div>
            <SmallSchoolIcons :school="school" :fields="fields" class="my-md-8 my-4" :imgSize="40" :font-size="1.5" :font-weight="400"/>
          </v-col>

          <!-- Map -->
          <v-col cols="12" md="6" offset-md="1">
            <Map :location="school.location" />

            <div class="d-flex mt-4">
              <div class="flex-grow-1">
                <v-icon size="small">mdi-map-marker</v-icon>
                <span class="ml-2">{{ city }}</span>, <span>{{ state }}</span> <span class="ml-2">{{ zip }}</span>
              </div>
              <a
                :href="generateMapLink(school)"
                @click="analytics.transitionOutboundLink($event)"
                target="_blank"
              >
                View on map
                <v-icon size="x-small" class="pl-1" color="primary-green">mdi-open-in-new</v-icon>
              </a>
            </div>
          </v-col>

        </v-row>

        <!-- Special Designations -->
        <v-row class="mt-3 pt-5" v-if="specialDesignations.length > 0">
          <v-col cols="12" class="px-sm-5">
            <p>Special Designations:</p>
            <Spacer :height="10" />
            <div class="school-special_designation">
              <v-chip
                class="mr-1 mb-1"
                color="#90caf9"
                variant="flat"
                label
                v-for="designation in specialDesignations"
                :key="designation"
              >
                {{ designation }}
              </v-chip>
            </div>
          </v-col>
        </v-row>

      </v-container> 

      <!-- SCHOOL BODY -->
      <div class="bg-white">
        <v-container>
          <v-row>
            <v-col cols="12">
              <SchoolInstitutionSummary :school="school" />

              <v-row>
                <v-col class="text-right">
                  <v-btn class="my-4 mr-2 text-uppercase" color="primary-green" @click="expandAllPanels">
                    Expand All
                  </v-btn>
                  <v-btn  class="my-4 text-uppercase" color="primary-green" @click="closeAllPanels">
                    Close All
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Field of Study Panel -->
              <v-expansion-panels multiple focusable v-model="panelsFOS">
                <v-expansion-panel class="fos-profile-panel" elevation="2">
                  <v-expansion-panel-title id="fields-of-study" @click="analytics.trackAccordion('Fields of Study')" class="field-of-study-title bg-tertiary-yellow">
                    <span>Fields of Study</span>
                    <v-btn
                      size="x-small"
                      icon="fa:fas fa-award"
                      class="bg-primary-yellow ml-2"
                      :readonly="true"
                    />
                  </v-expansion-panel-title>

                  <v-expansion-panel-text class="field-of-study-text ">
                    <SchoolPanelFieldOfStudy :school="school" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <Spacer :height="20" />

              <v-expansion-panels multiple focusable v-model="panels">
                <!-- Costs -->
                <v-expansion-panel>
                  <v-expansion-panel-title @click="analytics.trackAccordion('Costs')">
                    Costs
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <SchoolPanelCosts :school="school" />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Graduation & Retention -->
                <v-expansion-panel>
                  <v-expansion-panel-title @click="analytics.trackAccordion('Graduation &amp; Retention')">
                    Graduation &amp; Retention
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <SchoolPanelGraduationRetention :school="school" />
                  </v-expansion-panel-text>
                </v-expansion-panel>


                <!-- Financial Aid & Debt -->
                <v-expansion-panel>
                  <v-expansion-panel-title @click="analytics.trackAccordion('Financial Aid &amp; Debt')">
                    Financial Aid &amp; Debt
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <SchoolPanelFinancialAid :school="school" />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Typical Earnings -->
                <v-expansion-panel>
                  <v-expansion-panel-title @click="analytics.trackAccordion('Typical Earnings')">
                    Typical Earnings
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <SchoolPanelTypicalEarnings :school="school" />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Campus Diversity -->
                <v-expansion-panel>
                  <v-expansion-panel-title @click="analytics.trackAccordion('Campus Diversity')">
                    Campus Diversity
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <SchoolPanelCampusDiversity :school="school" />
                  </v-expansion-panel-text>
                </v-expansion-panel>


                <!-- Test Scores -->
                <v-expansion-panel>
                  <v-expansion-panel-title @click="analytics.trackAccordion('Test Scores and Acceptance')">
                    Test Scores and Acceptance
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <SchoolPanelTestScores :school="school" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <Spacer :height="60" />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <LayoutFooterCTA />
  </div>
</template>

<script setup>
const { formatUrlText } = useFilters()
const route = useRoute()
const { fields } = useConstants()
const { apiGet } = useApi()
const { breakpoints } = useVuetify()
const analytics = useAnalytics()
const { toNumber } = useNumberFormatter()

const school = reactive({})

const {
  underInvestigation: underInvestigationMethod,
  schoolName: schoolNameMethod,
  schoolUrl: schoolUrlMethod,
  schoolUrlDisplay: schoolUrlDisplayMethod,
  undergraduates: undergraduatesMethod,
  city: cityMethod,
  state: stateMethod,
  zip: zipMethod,
  specialDesignations: specialDesignationsMethod,
} = useComplexFieldMethods()

// Computed properties
const underInvestigation = computed(() => underInvestigationMethod(school))
const schoolName = computed(() => schoolNameMethod(school))
const schoolUrl = computed(() => schoolUrlMethod(school))
const schoolUrlDisplay = computed(() => schoolUrlDisplayMethod(school))
const undergraduates = computed(() => undergraduatesMethod(school))
const city = computed(() => cityMethod(school))
const state = computed(() => stateMethod(school))
const zip = computed(() => zipMethod(school))
const specialDesignations = computed(() => specialDesignationsMethod(school))

definePageMeta({ 
  middleware: 'school'
})

// DATA
// 
// 

const panels = ref([])
const panelsFOS = ref([])
const num_panels = ref(7)
const error = ref(false)

onMounted(() => {
  if (route.query.fos_code && route.query.fos_credential) {
    panelsFOS.value = [0]
  }
})

// COMPUTED
// 
// 
const schoolId = computed(() => {
  // Get the first key of the query object
  const key = Object.keys(route.query)[0]
  return key ? key : null
})

const metaTagsTitle = computed(() => {
  return school ? useGet(school, "school.name") + " | College Scorecard" : "College Scorecard"
})

const shareLink = computed(() => {
  const currentPath = route.fullPath
  const url = useRequestURL()
  const fullUrl = `${url.origin}${currentPath}`
  return encodeURI(fullUrl) || null
})

// METHODS
// 
// 
const trackState = (school) => {
  const state = useGet(school, "school.state")
  const previousStates = window.sessionStorage.getItem('states')
  if (state) {
    let states = previousStates ? JSON.parse(previousStates) : []
    if (previousStates && !states.includes(state)) {
      states.push(state)
      trackMultipleStates(states)
    }
    window.sessionStorage.setItem('states', JSON.stringify(states))
  }
}

const expandAllPanels = () => {
  panels.value = [...Array(num_panels.value).keys()].map((k, i) => i)
  panelsFOS.value = [0]
}

const closeAllPanels = () => {
  panels.value = []
  panelsFOS.value = []
}

const handleSchoolNameSelected = (school) => {
  if (typeof school == "string") {
    router.push("/search/?name=" + encodeURIComponent(school))
  } else {
    router.push(
      "/search/?name=" + encodeURIComponent(school["school.name"])
    )
  }
}

const generateMapLink = (school) => {
  const googleMapsBaseURL = "https://www.google.com/maps/search/?";
  const params = {
    api: 1,
    query: `${school.location.lat},${school.location.lon}`
  };
  const qs = new URLSearchParams(params).toString();
  return googleMapsBaseURL + qs;
};

const loading = ref(false)
const findSchool = async () => {
  try {
    loading.value = true
    const response = await apiGet("/schools/", { id: schoolId.value })
    loading.value = false
    const metadata = response.metadata
    const results = response.results
    const firstSchoolFound = results[0]
    
    if (metadata.total > 1) {
      error.value = true
      console.warn('More than one school found for ID: "' + id + '"')
      return null
  
    } else if (firstSchoolFound.latest.student.size <= 0) {
      error.value = true
      console.warn('School has size <= 0 for ID: "' + id + '"')
      return null
    }
    
    Object.assign(school, firstSchoolFound)

    // if (selectedFOS.value) {
    //   panelsFOS.value = [0]
    // }
    trackState()
  } catch (error) {
    error.value = true
    console.warn(error)
    console.warn("No School found for ID: " + schoolId.value)
  }
}

onMounted(() => {  
  findSchool()
})

// reload on route change
watch(() => route.fullPath , (newPath) => {
  const id = schoolId.value
  if (Object.keys(route.query)[0] !== id) {
    findSchool()
  }
})

useHead({
  metaTagsTitle,
  meta: [
    {
      key: "og:title",
      name: "og:title",
      content: "College Scorecard",
    },
    {
      key: "twitter:title",
      name: "twitter:title",
      content: "College Scorecard",
    },
    {
      name: 'description',
      content: 'The school profile provides a wealth of data, including average cost, graduation rates, financial aid and debt, typical earnings of graduates, and more.'
    },
    {
      name: 'keywords',
      content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, graduation rate, tuition cost, average annual cost, net price, median earnings, typical earnings, salary after completion, student outcomes, pell grant, loan payment, financial aid, federal loan, parent PLUS loan, repayment rate, repayment status, student faculty ratio, study body demographics, test scores, SAT, ACT, acceptance rate, FAFSA, GI Bill'
    }
  ],
})
</script>


<style lang="scss" scoped>
.field-of-study-text {
  :deep(.v-expansion-panel-text__wrapper) {
    padding: 0;
  }
}
.field-of-study-title {
  &:hover, &:focus {
    outline: 1px solid #cecece;
  }

  :deep(.v-expansion-panel-title__overlay) {
    opacity: 0 !important;
  }
}
</style>