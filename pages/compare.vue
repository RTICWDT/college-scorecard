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

  <v-container class="mt-2 mb-0">
    <v-row v-show="isViewingSharedComparison">
      <v-col>
        <v-card flat class="pa-4">
          <div class="d-flex flex-column flex-sm-row">
            <p class="pr-3 pb-3 pb-sm-0">You are viewing a shared comparison.</p>
            <v-btn
              size="small"
              color="secondary"
              @click="updateStoreToMatchSharedComparison"
              :disabled="!sharedComparisonIsLoading"
            >
              Update Your List to Match
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
                      Schools ({{ schoolCount }})
                    </h3>
                  </slot>
                </v-tab>

                <v-tab>
                  <slot name="tab-fos">
                    <h3 class="compare-tab-title pb-1">
                      Fields of Study ({{ fieldOfStudyCount }})
                    </h3>
                  </slot>
                </v-tab>
              </v-tabs>
            </div>

            <div v-show="isComparingSchools" class="px-4">
              <Spacer :height="20" />
              <CompareSchools :isViewingSharedComparison="isViewingSharedComparison" />
            </div>

            <div v-show="isComparingFieldsOfStudy" class="px-4">
              <Spacer :height="20" />
              <CompareFieldsOfStudy :isViewingSharedComparison="isViewingSharedComparison" />
            </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- The accordion contents of Compare Schools is rendered here via the vue Teleport component -->
  <!-- This isn't the best way to use teleports, but it solves the problem for this particular case -->
  <v-container v-show="isComparingSchools" id="teleport-accordion-container" />
  <Spacer :height="40" />
  <LayoutFooterCTA />
</template>

<script setup>
const store = useCompareStore()
const router = useRouter()
const route = useRoute()
const shareUrl = computed(() => {
  if (route.query.fos || route.query.s) {
    window.location.href
  }

  if (store.institutions.length === 0 && store.fos.length === 0) {
    return window.location.href
  }

  // query hacking for share parameters
  let params = { toggle: route.query.toggle, fos: '', s: '' }

  if (store.institutions.length > 0) {
    let ids = store.institutions.map((institution) => institution.id)
    params.s = `&s=${ids.join('&s=')}`
  }

  if (store.fos.length > 0) {
    let ids = store.fos.map((fos) => `${fos.unit_id}.${fos.code}.${fos.credential.level}`)
    params.fos = `&fos=${ids.join('&fos=')}`
  }

  return `${window.location.origin}${window.location.pathname}?toggle=${route.query.toggle}${params.s}${params.fos}`
})

// hacking og routes to match new router conventions, such that we can easily pull query params
const cleanedPath = route.fullPath.replace(/%26/g, '&').replace(/%3D/g, '=')
router.push(cleanedPath)

// school param  // &s={schoolId}
// field of study param // &fos={schoolID}.{fieldOfStudyCode}.{credentialLevel}


const toggleFields = ['institutions', 'fos']
const compareToggle = ref(Math.max(toggleFields.indexOf(route.query.toggle), 0))
const isComparingSchools = computed(() => route.query.toggle === 'institutions')
const isComparingFieldsOfStudy = computed(() => route.query.toggle === 'fos')

watch(() => route.query.toggle, (newToggle) => {
  if (newToggle === 'institutions') {
    compareToggle.value = 0
  } else if (newToggle === 'fos') {
    compareToggle.value = 1
  }
}, { immediate: true })

const handleCompareToggle = (value) => {
  const toggle = toggleFields[value]
  const newQuery = { ...route.query, toggle}
  router.replace({ query: newQuery })
}

const isViewingSharedComparison = computed(() => !!route.query.s || !!route.query.fos)

const schoolCount = computed(() => {
  if (store.temporaryInstitutions) {
    return store.temporaryInstitutions.length;
  } else if (isViewingSharedComparison.value) {
    const sharedSchools = route.query.s;
    if (!sharedSchools) { return 0; }
    if (sharedSchools && typeof sharedSchools === 'string') { return 1; } 
    return sharedSchools.length;
  } else {
    return store.institutions.length;
  }
});

const fieldOfStudyCount = computed(() => {
  if (store.temporaryFos) {
    return store.temporaryFos.length;
  } else if (isViewingSharedComparison.value) {
    const sharedFos = route.query.fos;
    if (!sharedFos) { return 0; }
    if (sharedFos && typeof sharedFos === 'string') { return 1; }
    return sharedFos.length;
  } else {
    return store.fos.length;
  }
});

const updateStoreToMatchSharedComparison = () => {
  store.fos = []
  store.temporaryFos.forEach((fos) => store.addFieldOfStudy(fos))

  store.institutions = []
  store.temporaryInstitutions.forEach((institution) => store.addSchool(institution))

  store.temporaryFos = null
  store.temporaryInstitutions = null
  router.replace(`/compare/?toggle=${route.query.toggle}`)
}

const sharedComparisonIsLoading = computed(() => {
  return Array.isArray(store.temporaryFos) && Array.isArray(store.temporaryInstitutions)
})

onBeforeRouteLeave(() => {
  if (isViewingSharedComparison.value) {
    store.temporaryFos = null
    store.temporaryInstitutions = null
  }
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