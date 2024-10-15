<template>
  <div class="bg-navyblue">
    <v-container class="pt-5 pb-6">
      <v-row>
        <v-col class="pa-0 text-right d-flex align-center justify-sm-end justify-space-evenly">
          <v-btn
            size="small"
            color="navyblue"
            id="referrer-link"
            class="link-more"
            @click="router.back()"
            >&laquo; Back</v-btn
          >
          <div class="flex-grow-1" />
          <Share
            variant="outlined"
            :elevation="0"
            label="Share this Comparison"
            :url="shareUrl"
            :hide="['email']"
            show-copy
            color="white"
            text
          />
        </v-col>
      </v-row>
    </v-container>
  </div>


  <v-container class="mt-5 mb-10">
    <v-row>
      <v-col>
        <v-card flat v-show="showShareUpdate" class="pa-5">
          <div>
            You are viewing a shared comparison.

            <v-btn
              small
              color="secondary"
              @click="handleCompareListSaveClick()"
            >
              Update Your List
            </v-btn>
          </div></v-card
        >
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pb-5 px-3" variant="flat">
            <h1 class="my-5 mx-5">Compare Schools and Fields of Study</h1>
            <hr />

            <div class="mx-md-4">
              <v-tabs
                :model-value="compareToggle"
                :show-arrows="true"
                slider-size="8"
                @update:modelValue="handleCompareToggle"
                :height="70"
                :style="{ width: '100%' }"
                :grow="true"
              >
                <v-tab>
                  <slot name="tab-school">
                    <h3 class="compare-tab-title">
                      Schools
                    </h3>
                  </slot>
                </v-tab>

                <v-tab>
                  <slot name="tab-fos">
                    <h3 class="compare-tab-title pb-1">
                      Fields of Study
                    </h3>
                  </slot>
                </v-tab>
              </v-tabs>
            </div>


            <!--Loader-->
            <div v-show="loading" class="show-loading ma-4">
              <div class="pa-5">
                <h1 class="title">
                  Loading
                  <v-icon color="darkblue" class="ml-2" size="x-small" icon="fa:fas fa-circle-notch fa-spin"/>
                </h1>
              </div>
            </div>


            <div v-show="isComparingSchools">
              <CompareSchools />
            </div>

            <div v-show="isComparingFieldsOfStudy">
              <CompareFieldsOfStudy />
            </div>
        </v-card>
      </v-col>
    </v-row>
    

  </v-container>
  





</template>

<script setup>
const router = useRouter()
const route = useRoute()
// hacking og routes to match new router conventions, such that we can easily pull query params
const cleanedPath = route.fullPath.replace(/%26/g, '&').replace(/%3D/g, '=')
router.push(cleanedPath)

// school param 
// &s={schoolId}

// field of study param
// &fos={fieldOfStudyId}.{fieldOfStudyCode}.{credentialLevel}


const store = useCompareStore()
const { apiGetAll } = useApi()
const { fields } = useConstants()
const { trackCompareList } = useAnalytics()

const toggleFields = ['institutions', 'fos']
const compareToggle = ref(Math.max(toggleFields.indexOf(route.query.toggle), 0))

const schools = ref([])
const fieldsOfStudy = ref([])

const isComparingSchools = computed(() => route.query.toggle === 'institutions')
const isComparingFieldsOfStudy = computed(() => route.query.toggle === 'fos')

const handleCompareToggle = (value) => {
  const toggle = toggleFields[value]
  compareToggle.value = value
  router.replace({ query: { toggle } })
}

onMounted(() => {

  
  // let schoolParams = route.query.institutions || store.institutions.map(school => school.schoolId)
  // let fieldOfStudyParams = route.query.fos || store.fieldsOfStudy.map(fos => fos.id)

  // debugger

  let params = {}
  params[fields.OPERATING] = 1
  params[fields.SIZE + "__range"] = "0.."
  params[fields.PREDOMINANT_DEGREE + "__range"] = "1..3"
  params[fields.ID + "__range"] = "..999999"
  params["fields"] = "latest,school,id,location"
  params["keys_nested"] = true
  params["all_programs"] = true

  // let schoolArray = []
  // let paramArray = []

  // if (passedSchools.value.length > 0) {
  //   passedSchools.value.forEach(id => {
  //     if (parseInt(id)) {
  //       schoolArray.push(parseInt(id))
  //       paramArray.push({ id: parseInt(id) })
  //     }
  //   })
  // } else {
  //   compareSchools.value.forEach(school => {
  //     let id = +school.schoolId || +school
  //     schoolArray.push(id)
  //     paramArray.push({ id: id })
  //   })
  //   modifyUrl()
  // }

  // console.log(params)

})

































const panels = ref([])
const num_panels = 6
// const schools = ref({
//   "2-year schools": [],
//   "4-year schools": [],
//   "Certificate schools": [],
// })

const compareSchools = ref([])
const compareFieldsOfStudy = ref([])

const currentRaceEthnicity = ref("American Indian/Alaska Native")
const currentIncomeFilter = ref("0-30000")
const currentRepaymentStatus = ref("makingprogress")
const currentSankey = ref({
  enroll: "enroll_both",
  study: "study_both",
})

const currentHighlight = ref("")
const currentFOSHighlight = ref("")
const loading = ref(true)
const mobilePanels = ref(0)
const desktopTabs = ref(1)
const cacheList = ref([])
const responseCache = ref({
  institution: [],
  fieldsOfStudy: [],
})

const hideShare = ["email"]
const displayToggle = ref("institutions")
const isSharedComparison = ref(false)
const isSharedFieldOfStudyComparison = ref(false)
const fosSalarySelect = ref("aid")
const fosSalarySelectItems = [
  { text: "Financial Aid Recipients", value: "aid" },
  { text: "Pell Grant Recipients", value: "pell" },
]

const fosFinancialCheckboxIncludePrior = ref(false)
const aidShowMedianDebtWithPrior = ref(false)
const showGradOnly = ref(false)
const showPellOnly = ref(false)
const aidLoanSelect = ref("fed")
const aidLoanSelectItems = [
  { text: "Federal Student Loans", value: "fed" },
  { text: "Parent Plus Loans", value: "plus" },
]

const medianToggle = ref("group")
const controlTabMedian = ref(0)
const controlTab = ref(0)
const sidebarSearchToggle = ref("school")


const shareUrl = computed(() => {
  // let origin = process.client ? window.location.origin : ""
  // // const compareBaseURL = customRouter.url("/compare/?")

  // let paramArray = {
  //   toggle: displayToggle.value,
  // }

  // if (passedSchools.value.length > 0) {
  //   paramArray.s = passedSchools.value
  // } else if (compareSchools.value.length > 0) {
  //   paramArray.s = compareSchools.value.map((school) => school.schoolId)
  // }

  // if (passedFieldsOfStudy.value.length > 0) {
  //   paramArray.fos = passedFieldsOfStudy.value
  // } else if (compareFieldsOfStudy.value.length > 0) {
  //   paramArray.fos = compareFieldsOfStudy.value.map((fieldOfStudy) => 
  //     generateFieldOfStudyUUID(
  //       fieldOfStudy.id,
  //       fieldOfStudy.code,
  //       fieldOfStudy.credentialLevel
  //     )
  //   )
  // }

  return route.fullPath
})

const showSearchForm = computed(() => {
  if (
    displayToggle.value === "institutions" &&
    (store.institutions.length > 0 || passedSchools.value.length > 0)
  ) {
    return false
  } else if (
    displayToggle.value === "fos" &&
    (store.fos.length > 0 || passedFieldsOfStudy.value.length > 0)
  ) {
    return false
  }
  return true
})

const showShareUpdate = computed(() => {
  if (compareSchools.value.length === 0 && passedSchools.value.length > 0) {
    return true
  }

  if (compareSchools.value.length > 0 && passedSchools.value.length > 0) {
    let compareSchoolsIDs = compareSchools.value.map((school) => school.schoolId)
    if (!_.isEqual(compareSchoolsIDs, passedSchools.value)) {
      return true
    }
  }
  return false
})

const showShareFieldOfStudyUpdate = computed(() => {
  if (
    compareFieldsOfStudy.value.length === 0 &&
    passedFieldsOfStudy.value.length > 0
  ) {
    return true
  }

  if (
    compareFieldsOfStudy.value.length > 0 &&
    passedFieldsOfStudy.value.length > 0
  ) {
    let compareFieldOfStudyStrings = compareFieldsOfStudy.value.map(
      (fieldOfStudy) =>
        generateFieldOfStudyUUID(
          fieldOfStudy.id,
          fieldOfStudy.code,
          fieldOfStudy.credentialLevel
        )
    )
    if (!_.isEqual(compareFieldOfStudyStrings, passedFieldsOfStudy.value)) {
      return true
    }
  }
  return false
})

const passedSchools = computed(() => {
  if (route.query.s) {
    return Array.isArray(route.query.s) ? route.query.s : [route.query.s]
  } else {
    return []
  }
})

const passedFieldsOfStudy = computed(() => {
  if (route.query.fos) {
    return Array.isArray(route.query.fos) ? route.query.fos : [route.query.fos]
  } else {
    return []
  }
})

const showResource = computed(() => {
  if (
    !loading.value &&
    !showSearchForm.value &&
    displayToggle.value === "institutions"
  ) {
    return displayToggle.value
  } else if (
    !loading.value &&
    !showSearchForm.value &&
    displayToggle.value === "fos"
  ) {
    return displayToggle.value
  } else {
    return false
  }
})

const filteredFieldsOfStudy = computed(() => {
  return categorizeFieldsOfStudy(responseCache.value.fieldsOfStudy)
})

const countSchools = computed(() => {
  return passedSchools.value.length || compareSchools.value.length
})

const countFieldsOfStudy = computed(() => {
  return passedFieldsOfStudy.value.length || compareFieldsOfStudy.value.length
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




// 
// METHODS
// 
// 

const all = () => {
  panels.value = [...Array(num_panels).keys()].map((k, i) => i)
}

const none = () => {
  panels.value = []
}

const queryInstitutions = () => {
  let params = {}
  params[fields.OPERATING] = 1
  params[fields.SIZE + "__range"] = "0.."
  params[fields.PREDOMINANT_DEGREE + "__range"] = "1..3"
  params[fields.ID + "__range"] = "..999999"
  params["fields"] = "latest,school,id,location"
  params["keys_nested"] = true
  params["all_programs"] = true

  let schoolArray = []
  let paramArray = []

  if (passedSchools.value.length > 0) {
    passedSchools.value.forEach(id => {
      if (parseInt(id)) {
        schoolArray.push(parseInt(id))
        paramArray.push({ id: parseInt(id) })
      }
    })
  } else {
    compareSchools.value.forEach(school => {
      let id = +school.schoolId || +school
      schoolArray.push(id)
      paramArray.push({ id: id })
    })
    modifyUrl()
  }

  trackCompareList(schoolArray.join(";"))

  loading.value = true
  apiGetAll("/schools/", paramArray)
    .then((responses) => {
      let schoolData = responses.map(response => response.data.results[0]).filter(Boolean)

      schoolData.forEach((school) => {
        if (passedSchools.value.length > 0) {
          responseCache.value.institution.push({
            schoolId: _.get(school, fields.ID),
            schoolName: _.get(school, fields.NAME),
          })
        }

        switch (_.get(school, fields.PREDOMINANT_DEGREE)) {
          case 1:
            schools.value["Certificate schools"].push(school)
            break
          case 2:
            schools.value["2-year schools"].push(school)
            break
          case 3:
            schools.value["4-year schools"].push(school)
            break
        }
      })

      loading.value = false
    })
    .catch((error) => {
      console.error("Issue locating schools for compare...", error)
      loading.value = false
    })
}

const queryFieldsOfStudy = (fieldsOfStudy) => {
  let params = {}
  params[fields.OPERATING] = 1
  params[fields.SIZE + "__range"] = "0.."
  params[fields.PREDOMINANT_DEGREE + "__range"] = "1..3"
  params[fields.ID + "__range"] = "..999999"

  let paramArray = fieldsOfStudy.map((fieldOfStudy) => ({
    ...params,
    [fields.ID]: fieldOfStudy.id,
    [fields.FIELD_OF_STUDY_CODE]: fieldOfStudy.code,
    [fields.FIELD_OF_STUDY_LENGTH]: fieldOfStudy.credential.level,
  }))

  loading.value = true
  apiGetAll("/schools/", paramArray)
    .then((responses) => {
      responseCache.value.fieldsOfStudy = responses
        .map(response => response.data.results[0]?.["latest.programs.cip_4_digit"][0])
        .filter(Boolean)
      loading.value = false
    })
    .catch((error) => {
      console.error("Issue locating Fields of Study for compare...", error)
      loading.value = false
    })
}

const handleCompareListSaveClick = () => {
  responseCache.value.institution.forEach(school => {
    store.toggleSchool(school)
  })
  responseCache.value.fieldsOfStudy.forEach(fos => {
    store.toggleFieldOfStudy({
      code: fos.code,
      credentialTitle: fos["credential.title"],
      fosTitle: fos.title,
      id: fos.unit_id,
      institutionName: fos["school.name"],
      credentialLevel: fos["credential.level"],
    })
  })
}

const handleChipCloseClick = (removeData, compareKey = localStorageKeys.COMPARE_KEY) => {
  switch (compareKey) {
    case localStorageKeys.COMPARE_KEY:
      store.toggleSchool(removeData)
      modifyUrl()
      break
    case localStorageKeys.COMPARE_FOS_KEY:
      store.toggleFieldOfStudy({
        code: removeData.code,
        credentialTitle: removeData["credential.title"],
        fosTitle: removeData.title,
        id: removeData.unit_id,
        institutionName: removeData["school.name"],
        credentialLevel: removeData["credential.level"],
      })
      modifyUrl()
      break
  }
}

const handleDisplayToggleClick = (toggleValue) => {
  displayToggle.value = Number(toggleValue) === 0 ? "institutions" : "fos"
  controlTab.value = toggleValue

  if (displayToggle.value === "institutions") {
    if (responseCache.value.institution.length === 0) {
      queryInstitutions()
    }
  } else if (displayToggle.value === "fos") {
    if (responseCache.value.fieldsOfStudy.length <= 0) {
      queryFieldsOfStudy(locateFieldsOfStudy())
    }
  }
  modifyUrl()
}

const locateFieldsOfStudy = () => {
  let itemsToQuery = []

  if (passedFieldsOfStudy.value.length > 0) {
    itemsToQuery = passedFieldsOfStudy.value.map(decodeFieldOfStudyUUID)
  } else {
    itemsToQuery = compareFieldsOfStudy.value.map(fieldOfStudy => ({
      id: fieldOfStudy.id,
      code: fieldOfStudy.code,
      credential: {
        level: fieldOfStudy.credentialLevel,
      },
    }))
    modifyUrl()
  }

  return itemsToQuery
}

const handleMedianToggle = (toggleValue) => {
  controlTabMedian.value = toggleValue
  medianToggle.value = toggleValue === 0 ? "group" : "all"
}

const handleSchoolNameSelected = (school) => {
  if (typeof school === "string") {
    router.push("/search/?search=" + encodeURIComponent(school))
  } else {
    router.push("/search/?search=" + encodeURIComponent(school["school.name"]))
  }
}

const handleFieldOfStudySelected = (fieldOfStudy) => {
  router.push("/search/?toggle=fos&cip4=" + encodeURIComponent(fieldOfStudy.cip4))
}


const modifyUrl = () => {
  // router.replace(shareUrl)
}








watch(compareSchools, () => {
  responseCache.value.institution = []
  schools.value["2-year schools"] = []
  schools.value["4-year schools"] = []
  schools.value["Certificate schools"] = []
  queryInstitutions()
})

watch(compareFieldsOfStudy, () => {
  responseCache.value.fieldsOfStudy = []
  schools.value["2-year schools"] = []
  schools.value["4-year schools"] = []
  schools.value["Certificate schools"] = []
  queryFieldsOfStudy(locateFieldsOfStudy())
})

watch(() => route.query.toggle, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    handleDisplayToggleClick(newValue === 'fos' ? 1 : 0)
  }
}, { immediate: true })

onMounted(() => {
  // set toggle from URL
  if (route.query.toggle === "fos") {
    displayToggle.value = "fos"
    controlTab.value = 1
    queryFieldsOfStudy(locateFieldsOfStudy())
  } else {
    displayToggle.value = "institutions"
    controlTab.value = 0
    queryInstitutions()
  }

  medianToggle.value = "group"
  controlTabMedian.value = 0

  // Did this initiate as a shared comparison
  isSharedComparison.value = showShareUpdate.value
  isSharedFieldOfStudyComparison.value = showShareFieldOfStudyUpdate.value
})


useHead({
  title: 'Compare',
  meta: [
    { name: 'og:title', content: 'Compare | College Scorecard' },
    { name: 'twitter:title', content: 'Compare | College Scorecard' },
    { name: 'description', content: 'Compare colleges nationwide. Compare data on cost, graduation rate, student outcomes, potential earnings, financial aid and debt, test scores, and more.' },
    { name: 'keywords', content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, graduation rate, tuition cost, average annual cost, net price, median earnings, typical earnings, salary after completion, student outcomes, pell grant, loan payment, financial aid, federal loan, parent PLUS loan, repayment rate, repayment status, study body demographics, test scores, SAT, ACT, acceptance rate' }
  ]
})
</script>