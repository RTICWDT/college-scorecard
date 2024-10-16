<template>
  <div v-if="loading">
    Loading...
  </div>

  <div v-else-if="fieldsOfStudy.length === 0">
    No Fields of Study found.
  </div>

  <div v-else>

    <div class="grid-container">
      <v-card 
        class="grid-item pa-4 mr-4"
        v-for="fieldOfStudy in fieldsOfStudy.all"
        :key="`${fieldOfStudy.id}${fieldOfStudy.code}`"
      >
        <div class="content d-flex">
          <div>
            <h4 class="text-body-2">
              {{ formatFieldOfStudyTitle(fieldOfStudy.title) }}
            </h4>
            <span class="fos-uppercase-credential-title">
              {{ formatFieldOfStudyCredentialTitle(fieldOfStudy.credential.title) }}
            </span>
            <br />
            <span class="text-caption">
              {{ fieldOfStudy.school.name }}
            </span>
          </div>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            icon="mdi-close"
            size="x-small"
            @click="removeFieldOfStudy(fieldOfStudy)"
            class="remove-btn ml-4"
          />
        </div>

      </v-card>
    </div>

    <hr class="my-10"/>
    <CompareFieldsOfStudySalaryAfterCompleting :fieldsOfStudy="fieldsOfStudy" />
    <hr class="my-10"/>
    <CompareFieldsOfStudyFinancialAid :fieldsOfStudy="fieldsOfStudy" />
    <hr class="my-10"/>
    <CompareFieldsOfStudyNumberOfGraduates :fieldsOfStudy="fieldsOfStudy" />

  </div>
</template>

<script setup>
import { formatFieldOfStudyTitle, formatFieldOfStudyCredentialTitle, unflattenObject } from '#imports';
const router = useRouter()
const route = useRoute()
const store = useCompareStore()
const { apiGetAll } = useApi()
const { fields } = useConstants()
const loading = ref(false)
const fieldsOfStudy = reactive({
  all: [],
  undergrad: [],
  associates: [],
  bachelors: [],
  baccalaureate: [],
  masters: [],
  doctorate: [],
  professionalDegree: [],
  professionalCertificate: [],
})



onMounted(() => {
  queryFieldsOfStudy()
})

const queryFieldsOfStudy = async () => {
  // if we have URL params for fields of study, use them and update the store to match
  const routeFieldsOfStudy = route.query.fos

  if (routeFieldsOfStudy) {
    store.fos = routeFieldsOfStudy.map((fos) => {
      const [id, code, credentialLevel] = fos.split(".")
      console.log("id, code, credentialLevel", id, code, credentialLevel)
      return {
        id: +id,
        code: +code,
        credentialLevel: +credentialLevel,
      }
    })    
  }
  
  let params = {}
  params[fields.OPERATING] = 1
  params[fields.SIZE + "__range"] = "0.."
  params[fields.PREDOMINANT_DEGREE + "__range"] = "1..3"
  params[fields.ID + "__range"] = "..999999"

  const paramArray = store.fos.map((fieldOfStudy) => ({
    ...params,
    [fields.ID]: fieldOfStudy.id,
    [fields.FIELD_OF_STUDY_CODE]: fieldOfStudy.code,
    [fields.FIELD_OF_STUDY_LENGTH]: fieldOfStudy.credentialLevel,
  }))

  try {
    loading.value = true
    const responses = await apiGetAll("/schools/", paramArray)

    const fosResults = responses.map(function(response) {
      if (response.results[0]) {
        const obj = response.results[0]["latest.programs.cip_4_digit"][0]
        const unflattened = unflattenObject(obj)
        unflattened.id = obj.unit_id
        unflattened.credentialLevel = unflattened.credential.level
        return unflattened
      }
    }).filter(Boolean)

    setFieldsOfStudy(fosResults)

  } catch (error) {
    console.error("Issue locating Fields of Study for compare...", error)
  } finally {
    loading.value = false
  }
}

const removeFieldOfStudy = (fieldOfStudy) => {
  const newFos = fieldsOfStudy.all.filter((fos) => fos.id !== fieldOfStudy.id)
  setFieldsOfStudy(newFos)
  store.removeFieldOfStudy(fieldOfStudy)
}

const setFieldsOfStudy = (fosResults) => {
  Object.assign(fieldsOfStudy, {
      all: fosResults,
      undergrad: fosResults.filter((fos) => fos.credential.level === 1),
      associates: fosResults.filter((fos) => fos.credential.level === 2),
      bachelors: fosResults.filter((fos) => fos.credential.level === 3),
      baccalaureate: fosResults.filter((fos) => fos.credential.level === 4),
      masters: fosResults.filter((fos) => fos.credential.level === 5),
      doctorate: fosResults.filter((fos) => fos.credential.level === 6),
      professionalDegree: fosResults.filter((fos) => fos.credential.level === 7),
      professionalCertificate: fosResults.filter((fos) => fos.credential.level === 8),
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