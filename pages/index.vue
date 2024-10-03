<template>
  <div>
    <!-- Top Splash and Search-->
    <div class="home-splash">
      <v-container class="mb-n10 pt-sm-10 pt-5">
        <v-row>
          <!-- Header Info -->
          <v-col cols="12" class="px-6 px-sm-3">
            <h1 style="color: white">
              Find the right fit
            </h1>

            <p style="color: white">
              Search and compare colleges: their fields of study, costs,
              admissions, results, and more.
            </p>
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
              <v-tab @click="GATrackEvent('Home Tab', 'Tab', 'Search Schools')">Search Schools</v-tab>
              <v-tab @click="GATrackEvent('Home Tab', 'Tab', 'Search Fields of Study')">Search Fields of Study</v-tab>
              <v-tab @click="GATrackEvent('Home Tab', 'Tab', 'Show Me Options')">Show Me Options</v-tab>
            </v-tabs>

            <v-tabs-window v-model="desktopTabs" class="home-search-wrapper">
              <v-tabs-window-item>
                <v-card class="pa-5" flat>
                  <SearchNameAutocomplete @school-name-selected="handleSchoolNameSelected" :searchEmptyName="false" />

                  <div class="mt-5 text-right">
                    <v-btn variant="text" size="small" @click="toggleCustomSearch = !toggleCustomSearch" class="text-uppercase">
                      Custom Search
                      <v-icon>{{ toggleCustomSearch ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
                    </v-btn>
                  </div>

                  <div v-if="toggleCustomSearch">
                    <!-- <search-form @search-query="directToSearch" :hideLocation="false" /> -->
                  </div>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item>
                <v-card class="pa-5 homepage-search-container" flat>
                  <v-row>
                    <v-col cols="12" sm="5">
                      <label class="d-block mb-2" for="fosSearch">Search Fields of Study (Required)</label>
                      <!-- <field-of-study-search @field-of-study-selected="handleFieldOfStudySelected" :selected="input.cip4" id="fosSearch" ariaRequired="true" /> -->
                    </v-col>
                    <v-col cols="12" sm="4">
                      <label class="d-block mb-2" for="fosDegree">Select Degree Type (Required)</label>
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
                      ></v-select>
                    </v-col>
                    <v-col cols="1" sm="3" class="">
                      <div class="d-none d-sm-block" style="height: 32px">
                        &nbsp;
                      </div>
                      <v-btn @click="handleFormSubmit" width="100%" size="x-large" color="secondary" :disabled="disableSearch">
                        Search
                        <v-icon>mdi-menu-right</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item>
                <v-card style="min-height: 300px" class="px-10 py-5" flat>
                  <!-- <canned-search-container @canned-search-submit="directToSearch"></canned-search-container> -->
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-col>


          <!--  -->
          <!-- Mobile Expansion Panels and Search -->
          <!--  -->

        </v-row>
      </v-container>
    </div>

    <!-- Bottom Content -->
    <div class="home-links pt-sm-15 mb-15">
      <v-container class="mt-8">
        <v-row class="align-stretch">
          <!-- apprenticeships callout -->
          <v-col cols="12" md="6" class="pr-sm-8">
            <v-card flat class="pa-8">
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
                  @click="transitionOutboundLink($event)"
                >
                  apprenticeship.gov
                  <v-icon size="x-small" color="#007000">mdi-open-in-new</v-icon>
                </a>
              </p>
              <hr />
              <p>
                Use the
                <a 
                  class="homeCallout-indent"
                  href="https://www.mynextmove.org"
                  target="_blank"
                  @click="transitionOutboundLink($event)"
                >
                  MyNextMove.org
                  <v-icon size="x-small" color="#007000">mdi-open-in-new</v-icon>
                </a>
                tool for career exploration and job analysis.
              </p>
              <hr />
              <p>
                Find training programs: compare completion rates, employment
                rates, and more on
                <a class="homeCallout-indent" href="https://trainingproviderresults.gov" target="_blank"
                  @click="transitionOutboundLink($event)">
                  TrainingProviderResults.gov
                  <v-icon size="x-small" color="#007000">mdi-open-in-new</v-icon>
                </a>.
              </p>
              <hr />
              <p>
                Visit
                <a class="homeCallout-indent" href="https://careeronestop.org" target="_blank"
                  @click="transitionOutboundLink($event)">
                  CareerOneStop.org
                  <v-icon size="x-small" color="#007000">mdi-open-in-new</v-icon>
                </a>, your source for career exploration training and jobs.
              </p>
              <hr />
              <p>
                Explore the
                <a class="homeCallout-indent" href="https://www.bls.gov/ooh/" target="_blank"
                  @click="transitionOutboundLink($event)">
                  Occupational Outlook Handbook (OOH)
                  <v-icon size="x-small" color="#007000">mdi-open-in-new</v-icon>
                </a>
                for detailed information about over 300 occupational profiles.
              </p>
            </v-card>
          </v-col>

          <!-- paying callout -->
          <v-col cols="12" md="6" sm="12" class="pl-sm-8">
            <v-card flat class="pa-8">
              <h2 class="display-2 d-flex justify-space-between align-center">
                <span class="">Learn More About<br />Paying for College</span>
                <v-avatar color="#D1E9FF">
                  <img src='~/assets/images/icon-financial-aid-black.svg' alt="Financial Aid Icon" class="pa-2" />
                </v-avatar>
              </h2>
              <hr />
              <p>
                You can learn more about the types of financial aid that are
                available at

                <a href="https://studentaid.gov" target="_blank" @click="transitionOutboundLink($event)">
                  StudentAid.gov 
                  <v-icon size="x-small" color="#007000">mdi-open-in-new</v-icon>
                </a>
              </p>

              <p>
                To receive financial aid, you must complete the Free
                Application for Federal Student Aid (FAFSA&#174;) form. You
                can use

                <a href="https://studentaid.gov/aid-estimator/" target="_blank" @click="transitionOutboundLink($)">
                  Federal Student Aid aid-estimator
                  <v-icon size="x-small" color="#007000">mdi-open-in-new</v-icon>
                </a>

                to see how much aid may be available to you.
              </p>

              <p class="my-10">
                <v-btn 
                  color="secondary" 
                  href="https://studentaid.gov/h/apply-for-aid/fafsa" 
                  target="_blank" 
                  size="large"
                  @click="transitionOutboundLink($event)"
                >
                  Start Your FAFSA&reg; Application
                  <v-icon size="normal" class="ml-1" color="#ffffff">mdi-open-in-new</v-icon>
                </v-btn>
              </p>

              <hr />

              <p>
                Veterans are eligible for higher education funding through the
                G.I. Bill benefits. Use the

                <a href="https://www.vets.gov/gi-bill-comparison-tool" target="_blank"
                  @click="transitionOutboundLink($event)">
                  GI Bill&reg; comparison tool
                  <v-icon size="x-small" color="#007000">mdi-open-in-new</v-icon>
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

<style lang="scss">
#homeIndexSearch {
  .v-tabs-window .v-card {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }

  .v-tab {
    font-family: variables.$header-font-family;
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

  .v-tab__slider {
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
  font-family: variables.$base-font-family !important;
  background-color: variables.$bg-blue !important;
}

.home-links {
  background-color: variables.$bg-gray;
}

.home-search-wrapper {
  box-shadow: 0 10px 16px rgba(0,0,0,.1019607843)!important;
}

fieldset {
  border: 0;
}
</style>

<script setup>
import { useDisplay } from "vuetify";
const { formMappings } = useConstants()
const { GATrackEvent, transitionOutboundLink, } = useAnalytics()
const { smAndDown } = useDisplay()

// debugger

// Import components
// import CannedSearchContainer from "~/components/CannedSearchContainer.vue"
// import SearchForm from "~/components/SearchForm.vue"
// import NameAutocomplete from "~/components/NameAutocomplete.vue"
// import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
// import CompareDrawer from "~/components/CompareDrawer.vue"
// import CompareHeader from "~/components/CompareHeader.vue"

// Router
const router = useRouter()

// Data
const mobilePanels = ref(0)
const desktopTabs = ref(0)
const toggleCustomSearch = ref(false)
const sliderColor = ref("#7BD88C")
const input = ref({
  cip4: null,
  cip4_degree: null,
})

// Computed
const fosDegrees = computed(() => formMappings.fosDegrees)
const disableSearch = computed(() => input.value.cip4 === null || input.value.cip4_degree === null)

// Methods
const colorSlider = (num) => {
  console.log(num)
  switch (num) {
    case 0:
      sliderColor.value = "#7BD88C"
      break
    case 1:
      sliderColor.value = "#FDB022"
      break
    default:
      sliderColor.value = "#FFFFFF88"
      break
  }
}

const directToSearch = (params) => {
  // Generate URL based on params
  const qs = new URLSearchParams(params).toString()
  const url = "/search/?" + qs.replace(/&{2,}/g, "&").replace(/%3A/g, ":")

  // Direct to location
  router.push(url)
}

const handleSchoolNameSelected = (school) => {
  if (typeof school === "string") {
    router.push("/search/?search=" + encodeURIComponent(school))
  } else {
    router.push("/search/?search=" + encodeURIComponent(school["school.name"]))
  }
}

const handleFieldOfStudySelected = (fieldOfStudy) => {
  input.value.cip4 = fieldOfStudy.cip4
}

const handleFormSubmit = () => {
  router.push(
    `/search/fos?cip4=${encodeURIComponent(input.value.cip4)}&cip4_degree=${encodeURIComponent(input.value.cip4_degree)}`
  )
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
