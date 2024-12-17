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
                  @onClear="() => {}"
                  :searchEmptyName="false"
                />
                <button class="search-button px-8 bg-primary-yellow font-weight-bold">SEARCH</button>
              </div>
              <Spacer :height="20" />
              <div class="d-flex align-center">
                <p class="mr-4">Or search by:</p>
                <button class="option-button mr-3">Near Me <v-icon size="small">mdi-map-marker-outline</v-icon></button>
                <button class="option-button">All Colleges</button>
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
  height: 35px !important;
}

:deep(.v-tab__slider) {
  height: 4px !important;  
}
</style>

<script setup>
const router = useRouter()
const analytics = useAnalytics()
const { formMappings } = useConstants()

const desktopTabs = ref(0)

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

const fosColor = computed(() => {
  return disableSearch.value ? "" : "primary-yellow"
})

const handleFormSubmit = () => {
  router.push(`/search/fos?cip4=${encodeURIComponent(input.cip4.code)}&cip4_degree=${encodeURIComponent(input.cip4_degree)}`)
}
</script>