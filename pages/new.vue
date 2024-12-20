<template>

  <!-- Splash -->
  <div class="bg-primary-blue section splash">
    <v-container>
      <v-row>
        <v-col>
          <h1 class="display-5">Search and compare colleges</h1>
          <Spacer :height="10" />

          <!-- MOBILE SPLASH -->
          <div class="d-block d-sm-none">
            <v-expansion-panels class="mb-2" v-model="mobilePanels">
              <!-- Mobile Institution Search -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <span class="home-mobile-search-title">Search Colleges</span>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <Spacer :height="10" />
                  <SearchSchool 
                    @onSubmit="handleSchoolNameSelected"
                    @onSearch="handleSchoolNameSelected"
                    @onClear="() => {}"
                    :searchEmptyName="false"
                    placeholder="Enter college name"
                  />

                  <p class="pt-3 pb-2">Or Search by:</p>
                  <div class="d-flex">
                    <button class="option-button dark mr-3 d-flex align-center" @click="searchCollegesByLocation()" :disabled="location.error">
                      <div class="mr-2">
                        Near Me
                      </div>
                      
                      <div v-if="location.isLoading">
                        <v-icon size="x-small" color="primary-blue" icon="fa:fas fa-circle-notch fa-spin" />
                      </div>
                      <div v-else-if="location.error">
                        <v-icon size="x-small" color="primary-blue" icon="mdi-alert-circle" />
                      </div>
                      <div v-else>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.99996 5.90567L11.146 1.22685L6.29732 11.067L6.14352 6.18331L0.99996 5.90567Z" stroke="#10274E" stroke-width="1.2" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </button>
                    <button class="option-button dark" @click="searchAllColleges">All Colleges</button>
                  </div>
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
                      <Spacer :height="10" />
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
                        :color="fosColor"
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
          </div>

          <!-- DESKTOP SPLASH -->
          <div class="d-none d-sm-block">
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
                  <div style="max-width: 767px; width: 100%">
                    <SearchCollegeHome
                      @onSubmit="handleSchoolNameSelected"
                      @onSearch="handleSchoolNameSelected"
                      @onInput="handleCollegeInput"
                      @onClear="() => {}"
                      :searchEmptyName="false"
                    />
                  </div>
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
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Search College -->
  <div class="bg-white section search-college">
    <v-container>
      <v-row class="align-center">
        <v-col cols="12" sm="6" lg="5">
          <p class="mb-2 h-tag tag-green">Search College</p>
          <h2 class="display-6 mb-6" style="max-width: 420px;">Search for colleges using filters</h2>
          <div class="position-relative">
            <div class="college-filter-highlight" :style="highlightStyle"></div>
          </div>
          <ul class="college-filter-list mb-7">
            <li @mouseenter="highlightStyle.top = '-10px'"><span>Search by Location</span></li>
            <li @mouseenter="highlightStyle.top = '28px'"><span>Filter by annual cost</span></li>
            <li @mouseenter="highlightStyle.top = '68px'"><span>Search by degree type</span></li>
          </ul>
          <v-btn 
            color="secondary-green text-uppercase h-tag font-weight-bold" 
            href="https://studentaid.gov/h/apply-for-aid/fafsa" 
            target="_blank"
            size="large"
            :height="60"
            :width="241"
          >
            Start your Search
          </v-btn>
        </v-col>
        <v-col class="d-none d-sm-block" cols="8" sm="6" lg="7">
          <div class="position-relative" style="height: 500px;">
            <img
              src="~/assets/images/home/search.png" 
              class="elevation-6 rounded-lg position-absolute layout-images search" 
              alt="College Search"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Compare Colleges -->
  <div class="bg-primary-blue section compare-colleges">
    <v-container>
      <v-row>
        <v-col cols="12" lg="5">
          <div style="max-width: 420px;"> 
            <p class="mb-2 h-tag tag-yellow">Compare Colleges</p>
            <h2 class="display-6 mb-6">See how colleges compare</h2>
            <p>Compare up to 10 colleges at once to make informed decisions about your path to college. </p>
            <div class="d-none d-lg-block">
              <Spacer />
              <div class="position-relative" style="height: 255px;">
                <img 
                  src="~/assets/images/home/median_debt.png" 
                  class="elevation-6 rounded-lg layout-images median_debt" 
                  alt="College Search"
                />
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" lg="7">
          <div class="position-relative z-front">
            <img 
              src="~/assets/images/home/school_1.png" 
              class="elevation-6 rounded-lg layout-images school_1" 
              alt="College Search"
            />
            <img 
              src="~/assets/images/home/school_2.png" 
              class="elevation-6 rounded-lg layout-images school_2" 
              alt="College Search"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- College Profiles -->
  <div class="section college-profiles">
    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="5">
          <div class="college-profiles-wrapper"> 
            <p class="mb-2 h-tag tag-green">View College Profiles</p>
            <h2 class="display-6 mb-6">Find the information that matters most <br v-if="breakpoints.lgAndUp.value" /> to you</h2>
            <p class="info-text mb-6">View U.S. Department of Education data about costs, student debt, graduation rates, admissions test scores and acceptance rates, student body diversity, post-college earnings, and more.</p>

            <v-btn 
              color="secondary-green text-uppercase h-tag font-weight-bold" 
              href="https://studentaid.gov/h/apply-for-aid/fafsa" 
              target="_blank"
              size="large"
              :height="60"
              :width="218"
            >
              Search Schools
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="6" lg="7" class="d-none d-md-block">
          <div class="position-relative">
            <img 
              src="~/assets/images/home/average_annual_cost.png" 
              class="elevation-6 rounded-lg position-absolute layout-images annual_cost" 
              alt="College Search"
            />
            <img 
              src="~/assets/images/home/acceptance_rate.png" 
              class="elevation-6 rounded-lg position-absolute layout-images acceptance_rate" 
              alt="College Search"
            />
          </div>
          <img 
            src="~/assets/images/home/graduation_rate.png" 
            class="elevation-6 rounded-lg layout-images graduation_rate" 
            alt="College Search"

          />
        </v-col>
      </v-row>
    </v-container>
  </div>

    <!-- Fields of Study -->
    <div class="bg-primary-aqua section fields-of-study">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" lg="5">
            <div class="search-fos-wrapper">
              <p class="mb-2 h-tag tag-white">Search fields of study</p>
              <h2 class="display-6 mb-6">Find what to study</h2>
              <p class="info-text mb-6">Search and compare the Fields of Study (majors and programs) offered at colleges and universities. Find information about the salaries and debt of graduates.</p>
              <NuxtLink to="search/fos-landing" class="text-white font-weight-bold text-decoration-none hover-underline">
                Search Fields of Study<v-icon size="x-small" color="white" class="ml-1">mdi-arrow-right</v-icon>
              </NuxtLink>
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="7" class="d-none d-md-block">
            <div class="position-relative">
              <img 
                src="~/assets/images/home/location.png" 
                class="elevation-6 rounded-lg position-absolute layout-images location" 
                alt="College Search"
              />
              <img 
                src="~/assets/images/home/psychology.png" 
                class="elevation-6 rounded-lg position-absolute layout-images psychology" 
                alt="College Search"
              />
              <img 
                src="~/assets/images/home/median_earnings.png" 
                class="elevation-6 rounded-lg position-absolute layout-images median_earning" 
                alt="College Search"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>


    <!-- ALternative Pathways / Resources -->
    <div class="section resources">
      <v-container class="d-none d-md-block">
        <v-row>
          <v-col cols="12" md="6" class="pr-md-8">
            <v-card flat class="pa-7 h-100 elevation-7">
              <HomeResources />
            </v-card>
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pl-md-8">
            <div class="d-flex flex-column h-100">
              <v-card flat class="px-7 py-9 elevation-7">
                <HomeFafsa />
              </v-card>
              <div class="flex-grow-1 my-3" />
              <v-card flat class="pa-7 bg-primary-blue elevation-7">
                <HomeVeterans theme="dark" />
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="d-block d-md-none bg-white pb-6">
        <v-row>
          <v-col>
            <HomeResources />
            <hr />
            <HomeFafsa />
          </v-col>
        </v-row>
      </v-container>
      <v-container class="d-block d-md-none pb-6">
        <v-row>
          <v-col>
            <HomeVeterans theme="light" />
          </v-col>
        </v-row>
      </v-container>
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

  &.dark {
    border: 1.5px solid use-theme('primary-blue');
    color: use-theme('primary-blue');
  }
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

.z-back {
  z-index: -1;
}

.z-front {
  z-index: 1;
}

.hover-underline {
  &:hover {
    text-decoration: underline !important;
  }
}

.college-profiles-wrapper {
  max-width: 350px;

  @include mdAndDown() {
    max-width: 500px;
  }
}

.search-fos-wrapper {
  max-width: 350px;

  @include mdAndDown() {
    max-width: 500px;
  }
}

.layout-images {
  &.search {
    width: 710px;
    height: 580px;
    bottom: -40px; 
    left: 15px;
  }

  &.median_debt {
    width: 589px;
    height: 310px;

    @include mdAndDown() {
      display:none;
    }
  }

  &.school_1 {
    width: 318px;
    height: 448px;
    left: 20px;
    position: absolute;

    @include mdAndDown() {
      position: static;
      margin-bottom: 30px;
    }

    @include smAndDown() {
      width: calc(318px - 40px);
      height: calc(448px - 40px);
    }
  }

  &.school_2 {
    width: 318px;
    height: 448px;
    left: 360px;
    position: absolute;

    @include mdAndDown() {
      position: static;
      margin-bottom: 30px;
      margin-left: 20px;
    }

    @include smAndDown() {
      display:none;
    }
  }

  &.graduation_rate {
    width: 386px;
    height: 412px;

    @include mdAndDown() {
      display:none;
    }
  }

  &.annual_cost {
    width: 332px;
    height: 205px;
    left: 300px;
    top: -50px;

    @include md() {
      left: 30px;
    }

    @include smAndDown() {
      display:none;
    }
  }

  &.acceptance_rate {
    width: 271px;
    height: 285px;
    left: 405px;
    top: 200px;

    @include md() {
      left: 170px;
      top: 140px;
    }

    @include smAndDown() {
      display:none;
    }
  }

  &.location {
    width: 260px;
    height: 316px;
    left: 0px;
    top: -100px;

    @include md() {
      left: 40px;
    }

    @include smAndDown() {
      display:none;
    }
  }

  &.psychology {
    width: 395px;
    height: 226px;
    left: 283px;
    top: -60px;

    @include mdAndDown() {
      display:none;
    }
  }

  &.median_earning {
    width: 473px;
    height: 258px;
    left: 190px;
    top: 190px;

    @include md() {
      left: 60px;
      width: calc(473px - 80px);
      height: calc(258px - 50px);
    }

    @include smAndDown() {
      display:none;
    }
  }
}


.section {
  &.splash {
    @include mdAndUp() {
      padding-top: 3rem;
    }

    @include smAndDown() {

    }
  }

  &.search-college {
    @include mdAndUp() {

    }

    @include smAndDown() {
      padding-top: 1rem;
      padding-bottom: 2rem;
    }
  }

  &.compare-colleges {
    @include mdAndUp() {
      padding-top: 5rem;
      padding-bottom: 1rem;
    }

    @include smAndDown() {
      padding-top: 1rem;
    }
  }

  &.college-profiles {
    @include mdAndUp() {
      padding-top: 5rem;
      padding-bottom: 7rem;
    }

    @include smAndDown() {
      padding-top: 1rem;
      padding-bottom: 2rem;
    }
  }

  &.fields-of-study {
    @include lgAndUp() {
      padding-top: 9rem;
      padding-bottom: 15rem;
    }

    @include md() {
      padding-top: 8rem;
      padding-bottom: 13rem;
    }

    @include smAndDown() {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }

  &.resources {
    @include mdAndUp() {
      padding-top: 2rem;
    }

    @include smAndDown() {
    }
  }
}

</style>

<script setup>
const router = useRouter()
const analytics = useAnalytics()
const { formMappings } = useConstants()
const { location, handleLocationCheck } = useLocationCheck();
const { breakpoints } = useVuetify()
const desktopTabs = ref(0)
const mobilePanels = ref(0)

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