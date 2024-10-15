<template>
  <div v-if="loading">Loading...</div>
  <div v-else v-for="fieldsOfStudy in fieldsOfStudy" :key="fieldsOfStudy.id">
    <div>{{ fieldsOfStudy.title }}</div>
  </div>
</template>

<script setup>
const store = useCompareStore()
const { apiGetAll } = useApi()
const { fields } = useConstants()
const loading = ref(false)
const fieldsOfStudy = ref([])

onMounted(() => {
  queryFieldsOfStudy()
})

const queryFieldsOfStudy = async () => {
  let params = {}
  params[fields.OPERATING] = 1
  params[fields.SIZE + "__range"] = "0.."
  params[fields.PREDOMINANT_DEGREE + "__range"] = "1..3"
  params[fields.ID + "__range"] = "..999999"

  let paramArray = store.fos.map((fieldOfStudy) => ({
    ...params,
    [fields.ID]: fieldOfStudy.id,
    [fields.FIELD_OF_STUDY_CODE]: fieldOfStudy.code,
    [fields.FIELD_OF_STUDY_LENGTH]: fieldOfStudy.credentialLevel,
  }))

  try {
    loading.value = true
    const responses = await apiGetAll("/schools/", paramArray)

    fieldsOfStudy.value = responses.map(function(response) {
      if (response.results[0]) {
        return response.results[0]["latest.programs.cip_4_digit"][0]
      }
    })


    // responseCache.value.fieldsOfStudy = responses
    //   .map(response => response.data.results[0]?.["latest.programs.cip_4_digit"][0])
    //   .filter(Boolean)
  } catch (error) {
    console.error("Issue locating Fields of Study for compare...", error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>


</style>