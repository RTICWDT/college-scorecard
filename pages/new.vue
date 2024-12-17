<template>
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
            <v-tabs-window-item style="height: 150px;">
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

            <v-tabs-window-item style="height: 150px;">
              <v-row class="pb-0 mt-2">
                <v-col class="pb-0" cols="12" sm="5"><label class="d-block mb-2" for="fosSearch">Search Fields of Study (Required)</label></v-col>
                <v-col class="pb-0" cols="12" sm="5"><label class="d-block mb-2" for="fosDegree">Select Degree Type (Required)</label></v-col>
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
</style>

<script setup>
const router = useRouter()
const analytics = useAnalytics()
const { formMappings } = useConstants()
const { location, handleLocationCheck } = useLocationCheck();

const desktopTabs = ref(0)

const handleSchoolNameSelected = (school) => {
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