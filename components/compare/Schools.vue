<template>
  <div v-if="loading">Loading...</div>
  <div v-else v-for="institution in institutions.all" :key="institution.id">
    <div>{{ institution.school.name }}</div>
  </div>
</template>

<script setup>
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
      const degree = useGet(school, fields["PREDOMINANT_DEGREE"])
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