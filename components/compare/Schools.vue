<template>
  <div v-if="loading">
    Loading...
  </div>

  <div v-else-if="institutions.all.length === 0">
    No Schools selected.
  </div>

  <div v-else>

    <div class="grid-container">
      <v-card v-for="institution in institutions.all" class="pa-4 d-flex align-center">
        <div class="mr-3 content">
          <p class="text-body-2">{{ institution.school.name }}</p>
        </div>
        <div class="flex-grow-1" />
        <v-btn
          :disabled="!!isViewingSharedComparison"
          class="remove-btn"
          color="primary"
          icon="mdi-close"
          size="x-small"
          @click="removeSchool(institution)"
        />
      </v-card>
    </div>

    <hr class="my-8"/>
    <CompareSchoolsOverview :institutions="institutions" />

    <Teleport to="#teleport-accordion-container">
      <v-row>
        <v-col class="text-right">
          <v-btn class="my-4 mr-2 text-uppercase" color="primary" @click="expandAllPanels">
            Expand All
          </v-btn>
          <v-btn  class="my-4 text-uppercase" color="primary" @click="closeAllPanels">
            Close All
          </v-btn>
        </v-col>
      </v-row>

      <v-expansion-panels multiple focusable v-model="panels">
        <!-- College Information -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="trackAccordion('College Information')">
            College Information
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsCollegeInformation :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Costs -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="trackAccordion('Costs')">
            Costs
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsCosts :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Graduation & Retention -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="trackAccordion('Graduation & Retention')">
            Graduation & Retention
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsGraduationAndRetention :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Financial Debt -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="trackAccordion('Financial Aid & Debt')">
            Financial Aid & Debt
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsFinancialAid :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Typical Earning -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="trackAccordion('Typical Earning')">
            Typical Earning
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <CompareSchoolsTypicalEarnings :institutions="institutions" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Test Scores & Acceptance -->
        <v-expansion-panel>
          <v-expansion-panel-title @click="trackAccordion('Test Scores & Acceptance')">
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
const { trackCompareList, trackAccordion } = useAnalytics()
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

const props = defineProps({
  isViewingSharedComparison: Boolean,
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
  
  trackCompareList(paramArray.map((institution) => institution.id).join(";"))

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
      store.temporaryInstitutions = institutions.all
    }
  } catch (error) {
    console.error("Issue locating schools for compare...", error)
  } finally {
    loading.value = false
  }
}

const setInstitutions = (institutions) => {
  institutions.all = schools
}

const removeSchool = (school) => {
  Object.assign(institutions, {
    all: institutions.all.filter((institution) => institution.id !== school.id),
    schoolsCertificate: institutions.schoolsCertificate.filter((institution) => institution.id !== school.id),
    schools2Year: institutions.schools2Year.filter((institution) => institution.id !== school.id),
    schools4Year: institutions.schools4Year.filter((institution) => institution.id !== school.id),
  })

  store.removeSchool(school)
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