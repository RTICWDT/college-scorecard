<template>
  <div>
    <!-- Top Splash and Search-->
    <div class="home-splash">
      <v-container class="mb-n10 pt-sm-10 pt-5">
        <v-row>
          <!-- Header Info -->
          <v-col cols="12" class="px-6 px-sm-3 text-white">
            <h1>Find the right fit</h1>
            <p>Search and compare colleges: their fields of study, costs, admissions, results, and more.</p>
          </v-col>
        </v-row>

        <v-row>

          <!-- Medium and Larger Tabs and Search Content -->
           <!--  -->
          <v-col id="homeIndexSearch" cols="12" class="d-none d-sm-block pb-0">
            <v-tabs
              bg-color="transparent"
              color="white"
              v-model="desktopTabs"
              @update:model-value="colorSlider"
              :slider-color="sliderColor"
            >
              <v-tab class="font-header" @click="analytics.GATrackEvent('Home Tab', 'Tab', 'Search Schools')">Search Schools</v-tab>
              <v-tab class="font-header" @click="analytics.GATrackEvent('Home Tab', 'Tab', 'Search Fields of Study')">Search Fields of Study</v-tab>
              <v-tab class="font-header" @click="analytics.GATrackEvent('Home Tab', 'Tab', 'Show Me Options')">Show Me Options</v-tab>
            </v-tabs>

            <v-tabs-window v-model="desktopTabs" class="home-search-wrapper">
              <v-tabs-window-item>
                <v-card class="pa-5" flat>
                  <SearchSchool 
                    @onSubmit="handleSchoolNameSelected"
                    @onSearch="handleSchoolNameSelected"
                    @onClear="() => {}"
                    :searchEmptyName="false"
                  />

                  <div class="mt-5 text-right">
                    <v-btn variant="text" size="small" @click="toggleCustomSearch = !toggleCustomSearch" class="text-uppercase">
                      Custom Search
                      <v-icon :icon="toggleCustomSearch ? 'mdi-menu-up' : 'mdi-menu-down'"></v-icon>
                    </v-btn>
                  </div>

                  <div v-if="toggleCustomSearch">
                    <Spacer :height="10" />
                    <SearchForm @search-submit="directToSearch" :hideLocation="false" :initiallyOpenPanelsByIndex="[0,1]" />
                  </div>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item>
                <v-card class="pa-5 homepage-search-container" flat>
                  <v-row class="pb-0">
                    <v-col class="pb-0" cols="12" sm="5"><label class="d-block mb-2" for="fosSearch">Search Fields of Study (Required)</label></v-col>
                    <v-col class="pb-0" cols="12" sm="5"><label class="d-block mb-2" for="fosDegree">Select Degree Type (Required)</label></v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="5">
                      <SearchFieldOfStudy v-model="input.cip4" />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        :items="fosDegrees"
                        item-title="label"
                        item-value="value"
                        variant="outlined"
                        placeholder="Select one"
                        v-model="input.cip4_degree"
                        hide-details
                        id="fosDegree"
                        color="primary-green"
                        aria-required="true"
                      />
                    </v-col>

                    <v-col cols="1" sm="3" class="">
                      <v-btn @click="handleFormSubmit" width="100%" size="x-large" color="secondary-green" :disabled="disableSearch">
                        Search
                        <v-icon>mdi-menu-right</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item>
                <v-card class="px-10 pt-5 pb-8" flat>
                  <p class="mb-5 mt-1">
                    Select one or more options to create a list of schools that fit your needs.
                  </p>
                  <SearchCannedContainer @canned-search-submit="directToSearch" />
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-col>

          <!--  -->
          <!-- Mobile Expansion Panels and Search -->
          <!--  -->
          <v-col cols="12" class="pa-5 d-block d-sm-none">
              <v-expansion-panels class="mb-2" v-model="mobilePanels">
                <!-- Mobile Institution Search -->
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <span class="home-mobile-search-title">Search Schools</span>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <SearchSchool
                      @onSubmit="handleSchoolNameSelected"
                      :searchEmptyName="false"
                      v-if="breakpoints.smAndDown.value"
                    />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Mobile FoS Search-->
              <v-expansion-panels class="mb-2">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <span class="home-mobile-search-title">Search Fields of Study</span>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <v-row>
                      <v-col cols="12" sm="5">
                        <label class="d-block mb-2" for="fosSearch">Search Fields of Study</label>
                        <SearchFieldOfStudy v-model="input.cip4" />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <label class="d-block  mb-2" for="fosDegree">Select Degree Type</label>
                        <v-select
                          :items="fosDegrees"
                          item-title="label"
                          item-value="value"
                          variant="outlined"
                          placeholder="Select one"
                          v-model="input.cip4_degree"
                          hide-details
                          id="fosDegree"
                          color="fos-search-color"
                          aria-required="true"
                        />
                      </v-col>
                      <v-col col="12" sm="3" class="">
                        <div class="d-none d-sm-block" style="height: 32px">
                          &nbsp;
                        </div>
                        <v-btn
                          @click="handleFormSubmit"
                          width="100%"
                          size="x-large"
                          color="secondary-green"
                          :disabled="disableSearch"
                        >
                          Search
                          <v-icon>mdi-menu-right</v-icon>
                        </v-btn></v-col
                      >
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Mobile Show me Options-->
              <v-expansion-panels class="mb-2">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <span class="home-mobile-search-title">Show Me Options</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <SearchCannedContainer @canned-search-submit="directToSearch" class="mx-5" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Bottom Content -->
    <div class="home-links pt-sm-15 mb-15">
      <v-container class="mt-8">
        <v-row class="align-stretch">
          <!-- apprenticeships callout -->
          <v-col cols="12" md="6" class="pr-md-8">
            <v-card flat class="pa-7 h-100">
              <h2 class="display-2 d-flex justify-space-between align-center">
                <span>Alternative Pathways<br />to a Career</span>
                <v-avatar color="#D1E9FF">
                  <img src="~/assets/images/Pathway-Icon.svg" alt="Pathways Icon" class="pa-2" />
                </v-avatar>
              </h2>
              <hr />
              <p>
                Search for apprenticeship jobs and programs on
                <a
                  class="homeCallout-indent"
                  href="https://www.apprenticeship.gov/apprenticeship-finder"
                  target="_blank"
                  @click="analytics.transitionOutboundLink($event)"
                >
                  apprenticeship.gov
                  <v-icon size="x-small" color="primary-green">mdi-open-in-new</v-icon>
                </a>
              </p>
              <hr />
              <p>
                Use the
                <a 
                  class="homeCallout-indent"
                  href="https://www.mynextmove.org"
                  target="_blank"
                  @click="analytics.transitionOutboundLink($event)"
                >
                  MyNextMove.org
                  <v-icon size="x-small" color="primary-green">mdi-open-in-new</v-icon>
                </a>
                tool for career exploration and job analysis.
              </p>
              <hr />
              <p>
                Find training programs: compare completion rates, employment
                rates, and more on
                <a class="homeCallout-indent" href="https://trainingproviderresults.gov" target="_blank"
                  @click="analytics.transitionOutboundLink($event)">
                  TrainingProviderResults.gov
                  <v-icon size="x-small" color="primary-green">mdi-open-in-new</v-icon>
                </a>.
              </p>
              <hr />
              <p>
                Visit
                <a class="homeCallout-indent" href="https://careeronestop.org" target="_blank"
                  @click="analytics.transitionOutboundLink($event)">
                  CareerOneStop.org
                  <v-icon size="x-small" color="primary-green">mdi-open-in-new</v-icon>
                </a>, your source for career exploration training and jobs.
              </p>
              <hr />
              <p>
                Explore the
                <a class="homeCallout-indent" href="https://www.bls.gov/ooh/" target="_blank"
                  @click="analytics.transitionOutboundLink($event)">
                  Occupational Outlook Handbook (OOH)
                  <v-icon size="x-small" color="primary-green">mdi-open-in-new</v-icon>
                </a>
                for detailed information about over 300 occupational profiles.
              </p>
            </v-card>
          </v-col>

          <!-- paying callout -->
          <v-col cols="12" md="6" sm="12" class="pl-md-8">
            <v-card flat class="pa-7 h-100">
              <h2 class="display-2 d-flex justify-space-between align-center">
                <span class="">Learn More About<br />Paying for College</span>
                <v-avatar color="#D1E9FF">
                  <img src='~/assets/images/icon-financial-aid-black.svg' alt="Financial Aid Icon" class="pa-2" />
                </v-avatar>
              </h2>
              <hr />
              <p class="mb-4">
                You can learn more about the types of financial aid that are
                available at

                <a href="https://studentaid.gov" target="_blank" @click="analytics.transitionOutboundLink($event)">
                  StudentAid.gov 
                  <v-icon size="x-small" color="primary-green">mdi-open-in-new</v-icon>
                </a>
              </p>

              <p>
                To receive financial aid, you must complete the Free
                Application for Federal Student Aid (FAFSA&#174;) form. You
                can use

                <a href="https://studentaid.gov/aid-estimator/" target="_blank" @click="analytics.transitionOutboundLink($)">
                  Federal Student Aid aid-estimator
                  <v-icon size="x-small" color="primary-green">mdi-open-in-new</v-icon>
                </a>

                to see how much aid may be available to you.
              </p>

              <p class="my-10">
                <v-btn 
                  color="secondary-green" 
                  href="https://studentaid.gov/h/apply-for-aid/fafsa" 
                  target="_blank" 
                  :size="breakpoints.smAndDown.value ? 'default' : 'large'"
                  @click="analytics.transitionOutboundLink($event)"
                >
                  Start Your FAFSA&reg; Application
                  <v-icon size="normal" class="ml-1" color="white">mdi-open-in-new</v-icon>
                </v-btn>
              </p>

              <hr />

              <p>
                Veterans are eligible for higher education funding through the
                G.I. Bill benefits. Use the

                <a href="https://www.vets.gov/gi-bill-comparison-tool" target="_blank"
                  @click="analytics.transitionOutboundLink($event)">
                  GI Bill&reg; comparison tool
                  <v-icon size="x-small" color="primary-green">mdi-open-in-new</v-icon>
                </a>

                to learn about education programs and compare benefits by
                school.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#homeIndexSearch {
  .v-tabs-window .v-card {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }

  .v-tab {
    font-size: 1rem;
    color: white;
    letter-spacing: normal;
    text-transform: uppercase;
  }

  .v-tab.v-tab--selected {
    font-weight: 700;
  }

  .home-mobile-search-title {
    font-size: 16px;
  }

  .tab-border-bottom {
    height: 8px;
  }

  :deep(.v-tab__slider) {
    height: 8px !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;    
  }

  .v-avatar img {
    border-radius: 6px;
  }
}
</style>

<style lang="scss" scoped>
h1 {
  font-size: 50px;
  text-transform: none;
}

h2 span {
  font-weight: 600 !important;
}

.home-splash {
  background-color: use-theme('primary-aqua') !important;
}

.home-links {
  background-color: use-theme('gray-100');
}

.home-search-wrapper {
  box-shadow: 0 10px 16px rgba(0,0,0,.1019607843)!important;
}

fieldset {
  border: 0;
}
</style>

<script setup>
const { formMappings } = useConstants()
const analytics = useAnalytics()
const { breakpoints } = useVuetify()
const router = useRouter()
const { color } = useVuetify()

const mobilePanels = ref(0)
const desktopTabs = ref(0)
const toggleCustomSearch = ref(false)
const sliderColor = ref(color('tertiary-green'))
// const input = ref({
//   cip4: null,
//   cip4_degree: null,
// })

// Computed
// const fosDegrees = computed(() => formMappings.fosDegrees)
// const disableSearch = computed(() => input.value.cip4 === null || input.value.cip4_degree === null)

// Methods
const colorSlider = (num) => {
  switch (num) {
    case 0:
      sliderColor.value = "tertiary-green"
      break
    case 1:
      sliderColor.value = "primary-yellow"
      break
    default:
      sliderColor.value = "gray-200"
      break
  }
}

const directToSearch = (params) => {
  router.push({ name: 'search', query: params })
}

const handleSchoolNameSelected = (school) => {
  if (typeof school === "string") {
    router.push("/search/?search=" + encodeURIComponent(school))
  } else {
    router.push("/search/?search=" + encodeURIComponent(school["school.name"]))
  }
}

const input = reactive({
  cip4: null,
  cip4_degree: null,
})

const fosDegrees = computed(() => formMappings.fosDegrees)
const disableSearch = computed(() => !input.cip4?.code || !input.cip4_degree)

const handleFormSubmit = () => {
  router.push(`/search/fos?cip4=${encodeURIComponent(input.cip4.code)}&cip4_degree=${encodeURIComponent(input.cip4_degree)}`)
}

// Meta
useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: "The U.S. Department of Education's College Scorecard has the most reliable data on college costs, graduation rates, and post-college earnings." },
    { name: 'keywords', content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings' }
  ]
})
</script>
