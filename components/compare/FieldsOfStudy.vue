<template>
  <div v-if="loading || fieldsOfStudy.all.length === 0" style="height: 500px" class="d-flex align-center justify-center">
    <div v-if="loading">
      <strong class="mr-1">Loading</strong> <v-icon icon="fa:fas fa-circle-notch fa-spin" size="small" />
    </div>

    <div v-else-if="fieldsOfStudy.all.length === 0" class="position-relative" style="bottom: 30px;">
      <h3 class="text-h4 font-weight-bold text-center mt-4">No fields of study selected to compare.</h3>
      <div class="text-center mt-8">
        <NuxtLink to="/search/fos-landing">
          <v-btn
            color="secondary"
            size="large"
          >
            Search Fields of Study
          </v-btn>
        </NuxtLink>
      </div>
      <p class="text-center mt-8">
        Try searching for fields of study and clicking the
        <v-btn icon tabindex="-1">
          <v-icon icon="fa:fa fa-check-circle" class="mx-1" color="grey" />
        </v-btn>
        to add a a field of study for comparison
      </p>
    </div>
  </div>

  <div v-if="!loading && fieldsOfStudy.all.length > 0">
    <div class="grid-container">
      <v-card 
        class="grid-item pa-4 mr-4"
        v-for="fieldOfStudy in fieldsOfStudy.all"
        :key="`${fieldOfStudy.id}${fieldOfStudy.code}`"
        :rounded="false"
        elevation="0"
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
          <v-tooltip text="Remove Field of Study">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                :disabled="!!isViewingSharedComparison"
                color="error"
                icon="fa:fa-solid fa-trash-can"
                size="x-small"
                @click="removeFieldOfStudy(fieldOfStudy)"
                class="remove-btn ml-4"
              />
            </template>
          </v-tooltip>
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

const props = defineProps({
  isViewingSharedComparison: Boolean,
})

const queryFieldsOfStudy = async () => {
  let params

  if (props.isViewingSharedComparison) {
    const routeFieldsOfStudy = Array.isArray(route.query.fos) ? route.query.fos : [route.query.fos].filter(Boolean);
    params = routeFieldsOfStudy.map((fos) => {
      const [id, code, credentialLevel] = fos.split(".")
      return {
        unit_id: Number(id),
        code: Number(code),
        credential: { level: Number(credentialLevel) },
      }
    })
  } else {
    params = store.fos
  }
  
  const paramArray = params.map((fieldOfStudy) => ({
    [fields.ID + "__range"]: "..999999",
    [fields.ID]: fieldOfStudy.unit_id,
    [fields.FIELD_OF_STUDY_CODE]: fieldOfStudy.code,
    [fields.FIELD_OF_STUDY_LENGTH]: fieldOfStudy.credential.level,
    [fields.OPERATING]: 1,
    [fields.SIZE + "__range"]: "0..",
    [fields.PREDOMINANT_DEGREE + "__range"]: "1..3",
    url: `${fieldOfStudy.unit_id}.${fieldOfStudy.code}.${fieldOfStudy.credential.level}`
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

    groupFieldsOfStudy(fosResults)
  } catch (error) {
    console.error("Issue locating Fields of Study for compare...", error)
  } finally {
    loading.value = false
  }
}

const removeFieldOfStudy = (fieldOfStudy) => {
  const newFos = fieldsOfStudy.all.filter((fos) => fos.id !== fieldOfStudy.id)
  groupFieldsOfStudy(newFos)
  store.removeFieldOfStudy(fieldOfStudy)
}

const groupFieldsOfStudy = (fosResults) => {
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

  if (props.isViewingSharedComparison) {
    store.temporaryFos = fieldsOfStudy.all.map((fos) => store.fieldOfStudyParams(fos))
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