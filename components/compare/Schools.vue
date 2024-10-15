<template>
  <div v-if="loading">
    Loading...
  </div>

  <div v-else-if="institutions.all.length === 0">
    No Schools found.
  </div>

  <v-container>
    <v-row>
      <v-col
        v-for="institution in institutions.all"
        :key="institution.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="pa-4 d-flex align-center">
          <div class="mr-3">
            <p>{{ institution.school.name }}</p>
          </div>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            icon="mdi-close"
            size="x-small"
            @click="() => { console.log('remove') }"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>
const router = useRouter()
const route = useRoute()
const store = useCompareStore()
const { apiGetAll } = useApi()
const { fields } = useConstants()
const { trackCompareList } = useAnalytics()
const loading = ref(false)
const institutions = ref({
  all: [],
  "Certificate schools": [],
  "2-year schools": [],
  "4-year schools": [],
})

onMounted(() => {
  querySchools()
})

const querySchools = async () => {
  const paramArray = store.institutions.map((institution) => ({ id: institution.schoolId }))
  trackCompareList(store.institutions.map((institution) => { institution.schoolId }).join(";"))

  try {
    loading.value = true
    const responses = await apiGetAll("/schools/", paramArray)
    
    institutions.value.all = responses.map(response => response.results[0]).filter(Boolean)

    institutions.value.all.forEach((institution) => {
      const degree = useGet(institution, fields["PREDOMINANT_DEGREE"])
      switch (degree) {
        case 1:
          institutions.value["Certificate schools"].push(institution)
          break
        case 2:
          institutions.value["2-year schools"].push(institution)
          break
        case 3:
          institutions.value["4-year schools"].push(institution)
          break
      }
    })
  } catch (error) {
    console.error("Issue locating schools for compare...", error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>

</style>