<template>

  <!-- Splash -->
  <div class="bg-primary-blue">
    <Spacer />
    <v-container>
      <v-row>
        <v-col>
          <h1 class="display-5">Search and compare colleges</h1>
          <Spacer :height="10" />

          <v-tabs
            bg-color="transparent"
            color="white"
            v-model="desktopTabs"
            slider-color="primary-yellow"
          >
            <v-tab class="tab-splash" @click="analytics.GATrackEvent('Home Tab', 'Tab', 'Search Schools')">Colleges</v-tab>
            <v-tab class="tab-splash" @click="analytics.GATrackEvent('Home Tab', 'Tab', 'Search Fields of Study')">Fields of Study</v-tab>
          </v-tabs>

          <v-tabs-window v-model="desktopTabs" class="home-search-wrapper">
            <v-tabs-window-item style="height: 210px;">
              <div class="d-flex mt-5">
                <SearchCollegeHome
                  @onSubmit="handleSchoolNameSelected"
                  @onSearch="handleSchoolNameSelected"
                  @onInput="handleCollegeInput"
                  @onClear="() => {}"
                  :searchEmptyName="false"
                />
                <button class="search-button px-8 bg-primary-yellow font-weight-bold" @click="searchCollegesFromInput">SEARCH</button>
              </div>
              <Spacer :height="20" />
              <div class="d-flex align-center">
                <p class="mr-4">Or search by:</p>
                <button class="option-button mr-3 d-flex align-center" @click="searchCollegesByLocation()" :disabled="location.error">
                  <div class="mr-2">
                    Near Me
                  </div>
                  
                  <div v-if="location.isLoading">
                    <v-icon size="x-small" icon="fa:fas fa-circle-notch fa-spin" />
                  </div>
                  <div v-else-if="location.error">
                    <v-icon size="x-small" icon="mdi-alert-circle" />
                  </div>
                  <div v-else>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.99996 5.90567L11.146 1.22685L6.29732 11.067L6.14352 6.18331L0.99996 5.90567Z" stroke="white" stroke-width="1.2" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </button>
                <button class="option-button" @click="searchAllColleges">All Colleges</button>
              </div>
            </v-tabs-window-item>

            <v-tabs-window-item style="height: 210px;">
              <v-row class="pb-0 mt-2">
                <v-col class="pb-0" cols="12" sm="5"><label class="d-block" for="fosSearch">Search Fields of Study (Required)</label></v-col>
                <v-col class="pb-0" cols="12" sm="5"><label class="d-block" for="fosDegree">Select Degree Type (Required)</label></v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="5">
                  <SearchFieldOfStudyHome v-model="input.cip4" />
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
                    color="primary-yellow"
                    bgColor="white"
                    aria-required="true"
                  />
                </v-col>

                <v-col cols="1" sm="3" class="">
                  <v-btn 
                    @click="handleFormSubmit"
                    width="100%" 
                    size="x-large" 
                    :color="fosColor"
                    :disabled="disableSearch"
                    class="font-weight-bold "
                  >
                    SEARCH
                  </v-btn>
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Search College -->
  <div class="bg-white">
    <Spacer />
    <v-container>
      <v-row>
        <v-col cols="4">
          <p class="mb-2 h-tag tag-green">Search College</p>
          <h2 class="display-6 mb-6">Search for colleges using filters</h2>
          <div class="position-relative">
            <div class="college-filter-highlight" :style="highlightStyle"></div>
          </div>
          <ul class="college-filter-list mb-7">
            <li @mouseenter="highlightStyle.top = '-10px'"><span>Search by Location</span></li>
            <li @mouseenter="highlightStyle.top = '28px'"><span>Filter by annual cost</span></li>
            <li @mouseenter="highlightStyle.top = '68px'"><span>Search by degree type</span></li>
          </ul>
          <v-btn 
            color="secondary-green text-uppercase h-tag" 
            href="https://studentaid.gov/h/apply-for-aid/fafsa" 
            target="_blank"
            size="large"
          >
            Start your Search
          </v-btn>
        </v-col>
        <v-col cols="8">
          <div class="bg-blue h-100 w-100"></div>
        </v-col>
      </v-row>
    </v-container>
    <Spacer />
  </div>

  <!-- Compare Colleges -->
  <div class="bg-primary-blue">
    <Spacer />
    <v-container>
      <v-row>
        <v-col cols="4">
          <p class="mb-2 h-tag tag-yellow">Compare Colleges</p>
          <h2 class="display-6 mb-6">See how colleges compare</h2>
          <p>Compare up to 10 colleges at once to make informed decisions about your path to college. </p>
        </v-col>
        <v-col cols="8">
          <div class="bg-blue h-100 w-100"></div>
        </v-col>
      </v-row>
    </v-container>
    <Spacer />
  </div>

  <!-- College Profiles -->
  <div>
    <Spacer />
    <v-container>
      <v-row>
        <v-col cols="4">
          <p class="mb-2 h-tag tag-green">View College Profiles</p>
          <h2 class="display-6 mb-6">Find the information that matters most <br v-if="breakpoints.lgAndUp.value" /> to you</h2>
          <p class="info-text">View U.S. Department of Education data about costs, student debt, graduation rates, admissions test scores and acceptance rates, student body diversity, post-college earnings, and more.</p>
        </v-col>
        <v-col cols="8">
          <div class="bg-blue h-100 w-100"></div>
        </v-col>
      </v-row>
    </v-container>
    <Spacer />
  </div>

    <!-- Fields of Study -->
    <div class="bg-primary-aqua">
      <Spacer />
      <v-container>
        <v-row>
          <v-col cols="4">
            <p class="mb-2 h-tag tag-white">Find what to study</p>
            <h2 class="display-6 mb-6">Find what to study</h2>
            <p class="info-text">Search and compare the Fields of Study (majors and programs) offered at colleges and universities. Find information about the salaries and debt of graduates.</p>
          </v-col>
          <v-col cols="8">
            <div class="bg-blue h-100 w-100"></div>
          </v-col>
        </v-row>
      </v-container>
      <Spacer />
    </div>


    <!-- ALternative Pathways / Resources -->
    <div>
      <Spacer />
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="pr-md-8">
            <v-card flat class="pa-7 h-100 elevation-7">
              <h3 class="display-7 d-flex justify-space-between align-center">
                Alternate Pathways and Resources
              </h3>
              <hr />
              <p>
                Search for apprenticeship jobs and programs on
                <a
                  class="home-callout"
                  href="https://www.apprenticeship.gov/apprenticeship-finder"
                  target="_blank"
                  @click="analytics.transitionOutboundLink($event)"
                >
                  apprenticeship.gov
                  <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
                </a>
              </p>
              <hr />
              <p>
                Use the
                <a 
                  class="home-callout"
                  href="https://www.mynextmove.org"
                  target="_blank"
                  @click="analytics.transitionOutboundLink($event)"
                >
                  MyNextMove.org
                  <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
                </a>
                tool for career exploration and job analysis.
              </p>
              <hr />
              <p>
                Find training programs: compare completion rates, employment
                rates, and more on
                <a class="home-callout" href="https://trainingproviderresults.gov" target="_blank"
                  @click="analytics.transitionOutboundLink($event)">
                  TrainingProviderResults.gov
                  <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
                </a>.
              </p>
              <hr />
              <p>
                Visit
                <a class="home-callout" href="https://careeronestop.org" target="_blank"
                  @click="analytics.transitionOutboundLink($event)">
                  CareerOneStop.org
                  <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
                </a>, your source for career exploration training and jobs.
              </p>
              <hr />
              <p>
                Explore the
                <a class="home-callout" href="https://www.bls.gov/ooh/" target="_blank" @click="analytics.transitionOutboundLink($event)">Occupational Outlook Handbook (OOH)
                  <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
                </a>
                for detailed information about over 300 occupational profiles.
              </p>
              <hr />
              <p>
                You can learn more about the types of financial aid that are  available at
                <a class="home-callout" href="https://studentaid.gov/" target="_blank" @click="analytics.transitionOutboundLink($event)">StudentAid.gov
                  <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
                </a>
              </p>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" sm="12" class="pl-md-8">
            <div class="d-flex flex-column h-100">
              <v-card flat class="px-7 py-9 elevation-7">
                <h3 class="display-7 mb-4">Start Your FAFSA® Application</h3>
                <p class="mb-4">To receive financial aid, you must complete the Free Application for Federal Student Aid (FAFSA).</p>
                <p  class="mb-7">
                  Use the 
                  <a class="home-callout" href="https://www.bls.gov/ooh/" target="_blank" @click="analytics.transitionOutboundLink($event)">FAFSA4caster
                    <v-icon size="x-small" color="secondary-green">mdi-open-in-new</v-icon>
                  </a>
                  to see how much aid may be available to you.
                </p>
                <v-btn 
                    color="secondary-green text-uppercase h-tag" 
                    href="https://studentaid.gov/h/apply-for-aid/fafsa" 
                    target="_blank" 
                    :size="breakpoints.smAndDown.value ? 'default' : 'large'"
                    @click="analytics.transitionOutboundLink($event)"
                  >
                    Start Your FAFSA&reg; Application
                  </v-btn>
              </v-card>

              <div class="flex-grow-1 my-3" />

              <v-card flat class="pa-7 bg-primary-blue elevation-7">
                <p>
                  Veterans are eligible for higher education funding through the G.I. Bill benefits. 
                  Use the
                  <a
                    href="https://www.vets.gov/gi-bill-comparison-tool"
                    target="_blank"
                    @click="analytics.transitionOutboundLink($event)"
                    class="text-tertiary-green"
                  >
                    GI Bill<sup>®</sup> comparison tool
                    <v-icon size="x-small" color="terriary-green">mdi-open-in-new</v-icon>
                  </a>
                  to learn about education programs and compare benefits 
                  by school.
                </p>
                <Spacer :height="10" />
                <p>
                  <a
                    href="https://www.vets.gov/gi-bill-comparison-tool"
                    target="_blank"
                    @click="analytics.transitionOutboundLink($event)"
                  >
                    <img
                      src="~/assets/images/VA-Logo.svg"
                      style="max-width: 300px"
                      alt="VA Logo"
                      width="300"
                      height="67"
                      contain
                    />
                  </a>
                </p>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <Spacer />
    </div>


</template>

<style scoped lang="scss">
.search-button {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 100;
  position: relative;
}

.option-button {
  border: 1.5px solid white;
  padding: 5px 15px;
  border-radius: 30px;
  font-size: 16px;
}

.tab-splash {
  font-size: 16px;
}

:deep(.v-tab--selected) {
  font-weight: bold;
}

:deep(.v-tab.v-tab.v-btn) {
  height: 40px !important;
}

:deep(.v-tab__slider) {
  height: 4px !important;  
}

.h-tag {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.48px;
  text-transform: uppercase;
  font-weight: 400;

  &.tag-green {
    color: use-theme('secondary-green');
  }

  &.tag-yellow {
    color: use-theme('primary-yellow');
  }

  &.tag-white {
    color: white;
  }
}

.info-text {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
}

.home-callout {
  color: use-theme('secondary-green');
}

.college-filter-list {
  li {
    list-style: none;

    &::before {
      content: '';
      display: inline-block;
      height: 16px;
      width: 16px;
      background-image: url('~/assets/images/checkmark.png');
      background-size:     cover;                      /* <------ */
      background-repeat:   no-repeat;
      background-position: center center;  
    }

    margin-bottom: 15px;
    position: relative;
    left: 10px;

    span {
      position: relative;
      bottom: 2px;
      left: 10px;
    }
  }
}

.college-filter-highlight {
  position: absolute;
  width: 228px;
  height: 40px;
  background-color: use-theme('primary-yellow');
  opacity: 0.2;
  border-radius: 3px;
  transition: top 0.3s;
}

</style>

<script setup>
const router = useRouter()
const analytics = useAnalytics()
const { formMappings } = useConstants()
const { location, handleLocationCheck } = useLocationCheck();
const { breakpoints } = useVuetify()
const desktopTabs = ref(0)

const highlightStyle = ref({
  top: "-10px",
})

const handleSchoolNameSelected = (school) => {
  if (school === "") {
    return
  }

  if (typeof school === "string") {
    router.push("/search/?search=" + encodeURIComponent(school))
  } else {
    router.push("/search/?search=" + encodeURIComponent(school["school.name"]))
  }
}

const collegeInput = ref(null)
const handleCollegeInput = (input) => {
  if (input) {
    collegeInput.value = input
  } else {
    collegeInput.value = null
  }
}

const searchCollegesFromInput = () => {
  if (collegeInput.value) {
    router.push("/search/?search=" + encodeURIComponent(collegeInput.value))
  }
}

const searchAllColleges = () => {
  router.push("/search/")
}

const input = reactive({
  cip4: null,
  cip4_degree: null,
})

const fosDegrees = computed(() => formMappings.fosDegrees)
const disableSearch = computed(() => !input.cip4?.code || !input.cip4_degree)

const fosColor = computed(() => {
  return disableSearch.value ? "" : "primary-yellow"
})

const handleFormSubmit = () => {
  router.push(`/search/fos?cip4=${encodeURIComponent(input.cip4.code)}&cip4_degree=${encodeURIComponent(input.cip4_degree)}`)
}

const searchCollegesByLocation = () => {
  console.log("searchCollegesByLocation")
  handleLocationCheck()
}

watch(location, (newVal) => {
  if (!newVal.latLon) {
    return
  }

  const latLon = newVal.latLon
  
  if (!latLon.min_lat || !latLon.max_lat || !latLon.min_lon || !latLon.max_lon) {
    return;
  }

  const query = {
    lat: latLon.min_lat + ".." + latLon.max_lat,
    long: latLon.min_lon + ".." + latLon.max_lat,
    distance: 50,
  }

  router.push({ name: 'search', query: query })
})
</script>