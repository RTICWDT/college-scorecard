<style lang="scss" scoped>
h1 {
  font-size: 50px;
  text-transform: none;
}
.v-card {
  height: 100%;
}
.home-splash {
  background-color: variables.$bg-blue !important;
}
.home-links {
  background-color: variables.$bg-gray;
}
.homepage-search-container {
  box-shadow: 0px 10px 16px #0000001a !important;
  border-radius: 0px 6px 6px 6px;
}
.tab-card {
  border: none;
}
</style>

<template>
  <div class="home-splash">
    <v-container class="mb-n10 pt-5 pt-10">
      <v-row>
        <v-col cols="12" class="px-6 px-sm-3">
          <h1 style="color: white">
            Search Fields of Study
          </h1>

          <p style="color: white">
            Search and compare the fields of study offered at each college
            by degree type.
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="pb-0">
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
                  color="#007000"
                  aria-required="true"
                />
              </v-col>
              <v-col cols="1" sm="3" class="">
                <v-btn @click="handleFormSubmit" width="100%" size="x-large" color="secondary" :disabled="disableSearch">
                  Search
                  <v-icon>mdi-menu-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Bottom Content -->
  <div class="home-links pt-15 mb-sm-15">
    <v-container class="mt-8">
      <v-row class="align-stretch">
        <v-col cols="12" md="6" class="pr-sm-8 pt-8 pt-sm-0">
          <v-card flat class="pa-8">
            <h2 class="text-h4 d-flex justify-space-between align-center">
              What are Fields of Study?
            </h2>
            <hr />
            <p>
              Fields of study are areas of academic concentration, or a
              discipline. Often known as majors, or programs.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" sm="12" class="pl-sm-8 pt-sm-0">
          <v-card flat class="pa-8">
            <h2 class="text-h4 d-flex justify-space-between align-center">
              Explore Fields of Study
            </h2>
            <hr />
            <p>
              College Scorecard's Field of Study search allows you to
              explore the subject areas of Certificate, Associate's,
              Bachelor's, and even advanced degrees offered at colleges all
              over the United States. Use College Scorecard to compare
              costs, earnings, and debt burdens between fields of study.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const { formMappings } = useConstants()
const router = useRouter()

const input = reactive({
  cip4: null,
  cip4_degree: null,
})

const fosDegrees = computed(() => formMappings.fosDegrees)
const disableSearch = computed(() => !input.cip4?.code || !input.cip4_degree)

const handleFormSubmit = () => {
  router.push(`/search/fos?cip4=${encodeURIComponent(input.cip4.code)}&cip4_degree=${encodeURIComponent(input.cip4_degree)}`)
}

useHead({
  title: 'Field of Study Search',
  meta: [
    { name: 'description', content: 'Search the fields of study offered at each school by degree type. Fields of study are areas of academic concentration (e.g, majors or programs).' },
    { name: 'keywords', content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings; field of study, program, major, CIP, Classification of Instructional Programs, salary after completing, median total debt, WIOA' }
  ],
})
</script>