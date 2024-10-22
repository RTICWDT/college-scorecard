<template>
  <div v-if="loading || institutions.all.length === 0" style="height: 500px" class="d-flex align-center justify-center">
    <div v-if="loading">
      <strong class="mr-1">Loading</strong> <v-icon icon="fa:fas fa-circle-notch fa-spin" size="small" />
    </div>

    <div v-else-if="institutions.all.length === 0" class="position-relative" style="bottom: 30px;">
      <h3 class="text-h4 font-weight-bold text-center mt-4">No schools selected to compare.</h3>
      <div class="text-center mt-8">
        <NuxtLink to="/search">
          <v-btn
            color="secondary-green"
            size="large"
          >
            Search Schools
          </v-btn>
        </NuxtLink>
      </div>
      <p class="text-center mt-8">
        Try searching for schools and clicking the
        <v-btn icon tabindex="-1">
          <v-icon icon="fa:fa fa-check-circle" class="mx-1" color="grey" />
        </v-btn>
        to add a school for comparison
      </p>
    </div>
  </div>

  <div v-if="!loading && institutions.all.length > 0">
    <div class="grid-container">
      <v-card v-for="institution in institutions.all" class="pa-4 d-flex align-center" :rounded="false" elevation="0">
        <div class="mr-3 content">
          <p class="text-body-2">{{ institution.school.name }}</p>
        </div>
        <div class="flex-grow-1" />

        <v-tooltip text="Remove School">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :disabled="!!isViewingSharedComparison"
              class="remove-btn"
              color="error"
              icon="mdi-close"
              size="x-small"
              @click="removeSchool(institution)"
            />
          </template>
        </v-tooltip>
      </v-card>
    </div>

    <hr class="mt-5 mb-4"/>
    <CompareSchoolsOverview :institutions="institutions" />

    <Teleport to="#teleport-accordion-container">
      <v-row>
        <v-col class="text-right">
          <v-btn class="my-4 mr-2 text-uppercase" color="primary-green" @click="expandAllPanels">
            Expand All
          </v-btn>
          <v-btn  class="my-4 text-uppercase" color="primary-green" @click="closeAllPanels">
            Close All
          </v-btn>
        </v-col>
      </v-row>

      <v-expansion-panels multiple focusable v-model="panels">
        <!-- College Information -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="analytics.trackAccordion('College Information')">
            College Information
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsCollegeInformation :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Costs -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="analytics.trackAccordion('Costs')">
            Costs
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsCosts :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Graduation & Retention -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="analytics.trackAccordion('Graduation & Retention')">
            Graduation & Retention
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsGraduationAndRetention :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Financial Debt -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="analytics.trackAccordion('Financial Aid & Debt')">
            Financial Aid & Debt
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsFinancialAid :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Typical Earning -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="analytics.trackAccordion('Typical Earning')">
            Typical Earning
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsTypicalEarnings :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Test Scores & Acceptance -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="analytics.trackAccordion('Test Scores & Acceptance')">
            Test Scores & Acceptance
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsTestScores :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </Teleport>

  </div>
</template>

<script setup>
const panels = ref([])
const totalPanels = ref(6)
const expandAllPanels = () => {
  panels.value = [...Array(totalPanels.value).keys()].map((k, i) => i)
}

const closeAllPanels = () => {
  panels.value = []
}

const router = useRouter()
const route = useRoute()
const store = useCompareStore()
const { apiGetAll } = useApi()
const { fields } = useConstants()
const analytics = useAnalytics()

const props = defineProps({
  isViewingSharedComparison: Boolean,
})

const loading = ref(false)
const institutions = reactive({
  all: [],
  schoolsCertificate: [],
  schools2Year: [],
  schools4Year: [],
})

onMounted(() => {
  querySchools()
})

const querySchools = async () => {
  let paramArray

  if (props.isViewingSharedComparison) {
    let params = route.query.s
    params = Array.isArray(params) ? params : [params].filter(Boolean);
    paramArray = params.map((id) => ({ id: Number(id) }))
  } else {
    paramArray = store.institutions.map((institution) => ({ id: institution.id }))
  }
  
  analytics.trackCompareList(paramArray.map((institution) => institution.id).join(";"))

  try {
    loading.value = true
    const responses = await apiGetAll("/schools/", paramArray)
    
    institutions.all = responses.map(response => response.results[0]).filter(Boolean)

    institutions.all.forEach((institution) => {
      const degree = useGet(institution, fields["PREDOMINANT_DEGREE"])
      switch (degree) {
        case 1:
          institutions.schoolsCertificate.push(institution)
          break
        case 2:
          institutions.schools2Year.push(institution)
          break
        case 3:
          institutions.schools4Year.push(institution)
          break
      }
    })

    if (props.isViewingSharedComparison) {
      store.temporaryInstitutions = institutions.all.map((institution) => store.schoolParams(institution))
    }
  } catch (error) {
    console.error("Issue locating schools for compare...", error)
  } finally {
    loading.value = false
  }
}

const removeSchool = (school) => {
  const newSchools = institutions.all.filter((institution) => institution.id !== school.id)
  groupSchools(newSchools)
  store.removeSchool(school)
}

const groupSchools = (schools) => {
  Object.assign(institutions, {
    all: schools,
    schoolsCertificate: schools.filter((school) => school.school.degrees_awarded.predominant === 1),
    schools2Year: schools.filter((school) => school.school.degrees_awarded.predominant === 2),
    schools4Year: schools.filter((school) => school.school.degrees_awarded.predominant === 3),
  })
}
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.grid-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content {
  flex-grow: 1;
}

.remove-btn {
  align-self: center;
}
</style>