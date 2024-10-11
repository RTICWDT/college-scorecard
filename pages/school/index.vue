<template>
  <v-container class="mt-5" v-if="!school.id && !error">
    <v-row>
        <v-col cols="12" lg="12" class="">
          <div class="show-loading">
            <h1 class="title text-center mt-15">
              <v-icon color="#00365e" icon="fa:fas fa-circle-notch fa-spin"/>
              Loading
            </h1>
          </div>
        </v-col>
      </v-row>
  </v-container>

  <v-container class="mt-5" v-else-if="error">
    <v-row>
        <v-col cols="12" lg="12" class="">
          <div>
            <v-card class="pa-5" elevation="0">
              <h2>Something went wrong</h2>
              <p>Try searching for a school by name:</p>
              <SearchNameAutocomplete
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
      <div id="school-sub-nav-header">
        <v-container>
          <v-row>
            <v-col class="text-right d-flex justify-sm-end justify-space-evenly">
              <v-btn
                small
                color="white"
                text
                id="referrer-link"
                class="link-more pl-1 pr-2"
                @click="$router.back()"
                >&laquo; Back</v-btn
              >

              <div class="flex-grow-1" />

              <!-- <add-to-compare :school="school" /> -->

              <Share
                small
                text
                color="white"
                label="Share this School"
                :url="shareLink"
                show-copy
                :hide="['email']"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Institution Summary Container-->
      <v-container>
        <v-row class="pt-5">
          <!-- School Information and Icons-->
          <v-col cols="12" md="5">
            <v-chip v-if="underInvestigation == 1" color="error" label>
              <strong>Under ED Monitoring</strong>
              &nbsp;
              <tooltip
                definition="hcm2"
                color="#FFFFFF"
                class="ml-2"
                :isBranch="isBranch"
              />
            </v-chip>
            <h1
              id="profile-institution-title"
              class="small-display-3 font-weight-bold pa-0 mb-4"
              v-if="smAndDown"
            >
              {{ schoolName }}
            </h1>
            <h1
              id="profile-institution-title"
              class="display-3 font-weight-bold pa-0 mb-4"
              v-else
            >
              {{ schoolName }}
            </h1>            
            <div class="population my-1">
              <span class="font-weight-bold">{{ numeral(undergraduates).format() }}</span>
              undergraduate students
            </div>
            <div class="school-url my-1">
              <a
                target="_blank"
                :href="schoolUrl"
                @click="transitionOutboundLink($event)"
              >
              {{  formatUrlText(schoolUrlDisplay) }}
              <v-icon size="x-small" class="pl-1" color="#007000">mdi-open-in-new</v-icon>
              </a>
            </div>
            <SmallSchoolIcons :school="school" :fields="fields" class="my-md-8 my-4" :imgSize="40" :font-size="1.5" :font-weight="400"/>
          </v-col>

          <!-- Map -->
          <v-col cols="12" md="6" offset-md="1">
            <div class="school-map mx-auto" v-if="school">
              <!-- <Map :location="school.location" /> -->
               <div style="background-color: red; height: 300px; width: 100%;" />
            </div>
            <div class="location mt-4">
              <div class="float-left">
                <!-- <location-icon class="location-icon pt-1" target="_blank" /> -->
                <span class="ml-2">{{ city }}</span
                >,
                <span>{{ state }}</span>
                <span class="ml-2">{{ zip }}</span>
              </div>
              <div class="float-right">
                <a
                  :href="generateMapLink(school)"
                  @click="transitionOutboundLink($event)"
                  target="_blank"
                >
                  View on map
                  <v-icon x-small class="pl-1" color="#007000">fas fa-external-link-alt</v-icon>
                </a>
              </div>
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
        <Spacer :height="10" />
      </v-container> 

      <!-- SCHOOL BODY -->
      <div class="bg-white">
        <v-container>
          <v-row>
            <v-col cols="12">
              <SchoolInstitutionSummary :school="school" />
            </v-col>
          </v-row>
        </v-container>
      </div>       
  </div>

  <LayoutFooterCTA />
</template>

<script setup>
import numeral from 'numeral'
import { useDisplay } from 'vuetify';
import {
  formatUrlText,
  yearsText,
} from '~/utils/filters'

const route = useRoute()
const { fields } = useConstants()
const { apiGet } = useApi()
const { smAndDown } = useDisplay()
const { transitionOutboundLink } = useAnalytics()
const school = ref({})
const {
  allFieldsOfStudy,
  underInvestigation,
  schoolName,
  schoolUrl,
  schoolUrlDisplay,
  undergraduates,
  city,
  state,
  zip,
  specialDesignations,




  medianEarnings,
  completionRateFieldDefinition,
  completionRate,
  isProgramReporter,
  netPrice,
  toggleGraduationRate,
  toggleAverageAnnualCosts,
  toggleMedianEarnings,
} = useComplexFields(school)



definePageMeta({ 
  middleware: 'school'
})

// DATA
// 
// 

const panels = ref([])
const panelsFOS = ref([])
const num_panels = ref(7)
const field_sort = ref("ipeds_award_count")
const hoistCurrency = ref(false)
const hoistGroupData = ref("numer of graduates")
const hoistGroupText = ref("largest")
const hoistCount = ref(0)
const error = ref(false)

const currentSankey = reactive({
  enroll: "enroll_both",
  study: "study_both",
})

const currentRepayment = reactive({
  enroll: "enroll_both",
  study: "study_both",
})

const showGradOnly = ref(false)
const showPellOnlyGrad = ref(false)
const showPellOnlyOutcomes = ref(false)

const selectedFOS = reactive({
  text: "",
})

const fosSalarySelect = ref("aid")
const fosSalarySelectItems = ref([
  { text: "Financial Aid Recipients", value: "aid" },
  { text: "Pell Grant Recipients", value: "pell" },
])

const fosShowDebtAtPrior = ref(false)
const fosShowDebtAtPriorPanel = ref(false)
const aidLoanSelect = ref("fed")
const aidLoanSelectItems = ref([
  { text: "Federal Student Loans", value: "fed" },
  { text: "Parent PLUS Loans", value: "plus" },
])

const aidShowMedianDebtWithPrior = ref(false)
const aidShowMonthlyPaymentWithPrior = ref(false)
const sidebarSearchToggle = ref("school")
const fieldDataExtendedSalarySelect = ref("aid")
const fieldDataExtendedShowPrior = ref(false)

const hadLoaded = ref(false)

const fos_tabs = ref([
  {
    group: "ipeds_award_count",
    active: true,
    groupName: "Largest Size",
  },
  {
    group: "highest_earnings",
    active: false,
    groupName: "Highest Earnings",
  },
  {
    group: "lowest_debt",
    active: false,
    groupName: "Lowest Debt",
  },
])

// COMPUTED
// 
// 
const schoolId = computed(() => {
  // Get the first key of the query object
  const key = Object.keys(route.query)[0]
  return key ? key : null
})

const metaTagsTitle = computed(() => {
  return school.value ? useGet(school.value, "school.name") + " | College Scorecard" : "College Scorecard"
})

const referer = computed(() => {
  return document.referrer || "/search/"
})

const shareLink = computed(() => {
  return encodeURI(window.location.href) || null
})

const groupName = computed(() => {
  return useGet(school.value, fields["PREDOMINANT_DEGREE"])
})

const fieldsOfStudy = computed(() => {
  let fos = allFieldsOfStudy.value
  if (!fos) {
    return []
  } else if (fos.length) {
    for (let q = 0; q < fos.length; q++) {
      fos[q].ipeds_award_count = useGet(fos[q], fields["FOS_GRAD_COUNT"])
      fos[q].highest_earnings = useGet(fos[q], fields["FOS_EARNINGS_FED_5YR"])
      fos[q].lowest_debt = useGet(fos[q], fields["FOS_DEBT_MEDIAN"])
      fos[q].hoist = fos[q][field_sort.value]
    }
    fos = fos.filter((field) => field.credential.level <= 3 && field.hoist)

    fos = useSortBy(fos, [
      function(o) {
        return o[field_sort.value]
      },
    ])
    if (["ipeds_award_count", "highest_earnings"].indexOf(field_sort.value) >= 0) {
      fos.reverse()
    }
    // Note: This might need to be handled differently as it's mutating state
    // hoistCount.value = fos.length
    fos = fos.slice(0, 5)
  } else {
    fos = [fos]
  }
  return fos
})

const currentHoist = computed(() => {
  let sort = field_sort.value
  switch (sort) {
    case "ipeds_award_count":
      // Note: These might need to be handled differently as they're mutating state
      // hoistCurrency.value = false
      // hoistGroupText.value = "largest"
      // hoistGroupData.value = "number of graduates"
      return "Graduates"
    case "highest_earnings":
      // hoistCurrency.value = true
      // hoistGroupText.value = "highest earning"
      // hoistGroupData.value = "earnings"
      return "Median Earnings"
    case "lowest_debt":
      // hoistCurrency.value = true
      // hoistGroupText.value = "with the least amount of debt"
      // hoistGroupData.value = "debt"
      return "Median Debt"
  }
})

const searchURL = computed(() => {
  let qs = returnURLFromStorage()
  if (qs) {
    return "/search/" + qs // Note: $url might need to be handled differently
  } else {
    return "/search/" // Note: $url might need to be handled differently
  }
})

const fosUndergradCount = computed(() => {
  if (!allFieldsOfStudy.value || allFieldsOfStudy.value.length === 0) {
    return 0
  }

  return allFieldsOfStudy.value.filter((fos) => {
    return fos.credential.level <= 3
  }).length
})

const selectedFOSDetail = computed(() => {
  if (
    selectedFOS.value === "" ||
    // selectedFOS.value === {} ||
    selectedFOS.value === null
  ) {
    return null
  }

  let locatedFOS = locateFOSObject(
    allFieldsOfStudy.value,
    selectedFOS.value.code,
    selectedFOS.value.credential.level
  )

  return {
    title: selectedFOS.value.text,
    ...locatedFOS,
  }
})

const fieldOfStudySelectItems = computed(() => {     
  if (!school.value || !allFieldsOfStudy.value) return []

  return organizeFieldsOfStudy(allFieldsOfStudy.value, CIP2)
})

const gradSubgroup = computed(() => {
  return showGradOnly.value ? "ugcomp" : "ug"
})

const sidebarSearchClass = computed(() => {
  return sidebarSearchToggle.value === "fos" 
    ? "field-of-study-select-container"
    : "institution-context-panel"
})

const sidebarRadioSchoolStyle = computed(() => {
  return sidebarSearchToggle.value === "fos" ? "normal" : "bold"
})

const sidebarRadioFOSStyle = computed(() => {
  return sidebarSearchToggle.value === "fos" ? "bold" : "normal"
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

const all = () => {
  panels.value = [...Array(num_panels.value).keys()].map((k, i) => i)
  panelsFOS.value = [0]
}

const none = () => {
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
  let googleMapsBaseURL = "https://www.google.com/maps/search/?"
  let params = {
    api: 1,
    query: school.location.lat + "," + school.location.lon
  }
  // let qs = querystring.stringify(params)
  let qs = ""
  return googleMapsBaseURL + qs
}

const organizeFieldsOfStudy = (availableFieldsOfStudy4, allCip2, filter = null) => {
  let processedPrograms = {}

  availableFieldsOfStudy4.forEach((program) => {
    if (program.credential.level === 3) {
      program.credential.title = "Bachelor's Degree"
    }

    let twodigit = program.code.substr(0, 2)
    if (
      useIncludes([1, 2, 3], program.credential.level) &&
      !processedPrograms[allCip2[twodigit]]
    ) {
      processedPrograms[allCip2[twodigit]] = []
    }

    if (useIncludes([1, 2, 3], program.credential.level)) {
      processedPrograms[allCip2[twodigit]].push(formatFOS(program))
    }
  })

  let sorted = []
  for (var cip2 in processedPrograms) {
    sorted.push({
      name: formatCip2Title(cip2),
      fields: useSortBy(processedPrograms[cip2], ["title"]),
    })
  }

  return useSortBy(sorted, ["name"])
}

const formatFOS = (fosObject) => {
  return {
    text: `${formatFieldOfStudyTitle(fosObject.title)} - ${fosObject.credential.title}`,
    value: `${fosObject.code}.${fosObject.credential.level}`,
    code: fosObject.code,
    credential: {
      level: fosObject.credential.level,
    },
  }
}

const locateFOSObject = (elements, code, credentialLevel) => {
  return useFind(elements, (fos) => {
    return fos.code === code && fos.credential.level === credentialLevel
  })
}

const mapFOSFromURL = (params, elements) => {
  if (
    typeof params.fos_code === "undefined" &&
    /^\d{3,4}$/.test(params.fos_code) === false
  ) {
    return null
  }

  if (
    typeof params.fos_credential === "undefined" &&
    /^\d{1}$/.test(params.fos_credential) === false
  ) {
    return null
  }

  let locatedFOS = useFind(allFieldsOfStudy.value, (fos) => {
    return (
      fos.code == params.fos_code &&
      fos.credential.level == params.fos_credential
    )
  })

  return locatedFOS ? formatFOS(locatedFOS) : null
}

// const generateQueryString = (params) => {
//   let qs = querystring.stringify(params)
//   return (
//     "?" +
//     qs
//       .replace(/^&+/, "")
//       .replace(/&{2,}/g, "&")
//       .replace(/%3A/g, ":")
//   )
// }

const generateCompareFieldOfStudy = (fosObject) => {
  return {
    id: fosObject.unit_id,
    code: fosObject.code,
    credentialLevel: fosObject.credential.level,
    credentialTitle: fosObject.credential.title,
    institutionName: fosObject.school.name,
    fosTitle: fosObject.title,
  }
}

const handleExtendedFieldSelect = (event) => {
  // Implementation
}

const handleFieldOfStudyClear = () => {
  selectedFOS.value = null
}

const handleFieldOfStudySelected = (fieldOfStudy) => {
  router.push(
    "/search/?toggle=fos&cip4=" + encodeURIComponent(fieldOfStudy.cip4)
  )
}

const checkTipUpperStyle = (upperValue, maxValue, upperStyleTipOverride) => {
  let additionalPaddingStyles = upperStyleTipOverride

  if (Number(upperValue) >= maxValue * 0.85) {
    additionalPaddingStyles.left = "-3.1rem"
  }

  return additionalPaddingStyles
}

const checkUpperStyle = (value, maxValue, upperStyleOverride) => {
  let additionalPaddingStyles = upperStyleOverride

  if (Number(value) >= maxValue * 0.97) {
    additionalPaddingStyles.left = "97%"
  }

  return additionalPaddingStyles
}

const handleToggle = (toggleValue) => {
  field_sort.value = fos_tabs.value[toggleValue].group
}

onMounted(async () => {  
  // const params = {
  //   [fields.OPERATING]: 1,
  //   [fields.OPEID + "__not"]: "null",
  //   [fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"]: true,
  //   [fields.SIZE + "__range"]: "1..",
  //   [fields.PREDOMINANT_DEGREE + "__range"]: "1..3",
  //   [fields.ID + "__range"]: "..999999",
  //   fields: "latest,school,id,location",
  //   keys_nested: true
  // }

  try {
    const response = await apiGet("/schools/", { id: schoolId.value })
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
    
    school.value = firstSchoolFound

    selectedFOS.value = mapFOSFromURL(route.query, fieldOfStudySelectItems)

    if (selectedFOS.value) {
      panelsFOS.value = [0]
    }
    trackState()
  } catch (error) {
    console.log(error)
    error.value = true
    console.warn("No School found for ID: " + schoolId.value)
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

#school-sub-nav-header {
  background-color: variables.$bg-blue;
}
.yellow-warn {
  background: #fff3cf;
}
.leaflet-bottom {
  z-index: 100 !important;
}

.profile-fos-include-prior-debt {
  font-size: 12px;

  @media (min-width: 960px) {
    font-size: 16px;
  }
}

#fields-of-study.v-expansion-panel-header
  > :not(.v-expansion-panel-header__icon) {
  flex: none;
}

.compare-selected-text {
  background-color: variables.$light-blue !important;
}

#profile-institution-title {
  line-height: 100% !important;
  color: #10274e;
}

.field-of-study-select-container {
  border-radius: 4px !important;
  border-left: 20px solid variables.$fos-color-gold !important;
}

.field-of-study-select-container-header {
  border-radius: 5px 5px 0px 0px !important;
}

.institution-context-panel {
  border-radius: 4px !important;
  border-left: 20px solid variables.$darker-green !important;
}

#field-of-study-select-header {
  h2 {
    margin-top: 7px;
    margin-left: 6px;
    font-size: 1.35rem;
    display: inline-block;
    vertical-align: top;
    text-transform: uppercase;
  }

  @media (min-width: 960px) {
    h2 {
      margin-top: 12px;
      margin-left: 10px;
    }
  }

  #field-of-study-select-icon {
    height: 34px;
    width: 34px;
    background: variables.$fos-color-gold;
    border-radius: 50%;
    display: inline-block;
    color: black;
    text-align: center;

    i {
      font-size: 24px;
      margin-top: 5px;
    }

    @media (min-width: 960px) {
      width: 50px;
      height: 50px;

      i {
        font-size: 35px;
        margin-top: 8px;
      }
    }
  }
}

.fos-profile-panel {
  width: 100%;
  //border-left: 10px solid variables.$fos-color-gold;
  margin-bottom: 20px;

  @media (min-width: 960px) {
    font-size: 16px;
    //border-left: 20px solid variables.$fos-color-gold;
  }
}

#fields-of-study.v-expansion-panel-header {
  background-color: variables.$fos-color-yellow !important;
}

#fields-of-study.v-expansion-panel-header:before {
  opacity: 0 !important;
}

.fos-profile-mini-summary-info {
  width: 100%;
  /*background-color: #eaeaea;*/
  border-left: 10px solid variables.$fos-color-gold;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  -webkit-box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  -moz-box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  /*<!--box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);-->*/
  border-top: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}

.institution-profile-panel {
  width: 100%;
  //border-left: 10px solid variables.$institution-accent-color;

  @media (min-width: 960px) {
    font-size: 16px;
    //border-left: 20px solid variables.$institution-accent-color;
  }
}

.field-of-study-select-icon {
  width: 50px;
  height: 50px;
  background: variables.$fos-color-gold;
  border-radius: 50%;
  color: black;
  text-align: center;
  display: inline-block !important;
  flex: none !important;
  z-index: 8; // Above highlight for active expansion panel
  i {
    font-size: 35px;
    margin-top: 8px;
  }
}

#fos-number-grads {
  h2,
  h3 {
    display: inline-block;
    vertical-align: middle;
  }
}

.fos-sub-title-header:not(.top-fos-sub-title-header) {
  background-color: #e5e5e5;

  h3 {
    font-weight: 500;
  }
}

.fos-small-data-bold {
  font-size: 1.5rem !important;
  font-weight: bold;
}

.fos-profile-mini {
  h3 {
    display: inline;
    vertical-align: middle;
  }
}

#school-completion-rate-bar {
  margin-bottom: 55px;
  padding-top: 0px !important;
}

#school-salary-after-complete {
  margin-bottom: 55px;
}

#profile-field-of-study-summary-metric-container {
  /*height: 320px;*/
  padding-top: 20px !important;
}

#profile-field-of-study-summary-metric-empty {
  /*height: 320px;*/
  height: auto;
}

#showGradOnly,
#showPellOnlyGrad,
#showPellOnlyOutcomes {
  .v-messages {
    display: none;
  }
}

span.arrow-left {
  $arrow-size: 7px;
  width: 0;
  height: 0;
  border-top: $arrow-size solid transparent;
  border-bottom: $arrow-size solid transparent;
  border-right: $arrow-size solid black;
  margin-top: 0;
}

.location-icon {
  height: 20px;
  width: 20px;
}

#field-of-study-select-search-container2 {
  background-color: variables.$fos-color-yellow;
  padding-bottom: 24px;
}

.small-display-3 {
  font-size:2.6rem;
}
</style>