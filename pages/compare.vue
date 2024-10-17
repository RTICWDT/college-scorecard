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

  <v-container class="mt-5 mb-0">
    <v-row v-show="isViewingSharedComparison">
      <v-col>
        <v-card flat  class="pa-5">
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
                      Schools ({{ store.institutions.length }})
                    </h3>
                  </slot>
                </v-tab>

                <v-tab>
                  <slot name="tab-fos">
                    <h3 class="compare-tab-title pb-1">
                      Fields of Study ({{ store.fos.length }})
                    </h3>
                  </slot>
                </v-tab>
              </v-tabs>
            </div>

            <div v-show="isComparingSchools" class="px-4">
              <Spacer :height="20" />
              <CompareSchools />
            </div>

            <div v-show="isComparingFieldsOfStudy" class="px-4">
              <Spacer :height="20" />
              <CompareFieldsOfStudy />
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
const toggleFields = ['institutions', 'fos']
const compareToggle = ref(Math.max(toggleFields.indexOf(route.query.toggle), 0))
const isComparingSchools = computed(() => route.query.toggle === 'institutions')
const isComparingFieldsOfStudy = computed(() => route.query.toggle === 'fos')

const shareUrl = computed(() => {
  const toggle = toggleFields[compareToggle.value]
  return `${window.location.origin}${window.location.pathname}?toggle=${toggle}`
})

const handleCompareToggle = (value) => {
  const toggle = toggleFields[value]
  compareToggle.value = value
  router.replace({ query: { toggle } })
}

const isViewingSharedComparison = computed(() => false) 

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