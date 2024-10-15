<template>
  <div v-if="loading">
    Loading...
  </div>

  <div v-else-if="institutions.all.length === 0">
      No Schools found.
    </div>

  <div v-else>

  <div class="grid-container">
    <v-card v-for="institution in institutions.all" class="pa-4 d-flex align-center">
      <div class="mr-3 content">
        <p class="text-body-2">{{ institution.school.name }}</p>
      </div>
      <div class="flex-grow-1" />
      <v-btn
        class="remove-btn"
        color="primary"
        icon="mdi-close"
        size="x-small"
        @click="() => { console.log('remove') }"
      />
    </v-card>
  </div>

    <hr />
    <CompareSchoolsOverview :institutions="institutions" />

  </div>
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
  schoolsCertificate: [],
  schools2Year: [],
  schools4Year: [],

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
          institutions.value.schoolsCertificate.push(institution)
          break
        case 2:
          institutions.value.schools2Year.push(institution)
          break
        case 3:
          institutions.value.schools4Year.push(institution)
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