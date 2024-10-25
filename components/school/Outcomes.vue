<template>
  <v-card flat class="pa-4">
    <v-row class="d-flex">
      <v-col cols="12" md="12">
        <h2 class="mb-0">
          Outcomes 8 Years After Attending&nbsp;
          <TooltipModal
            definition="outcome-measures"
            :isPell="showPellOnly"
          />
        </h2>
        <v-checkbox
          v-model="showPellOnly"
          label="Show Pell Grant Recipients Only"
          color="secondary-green"
          class="mt-0 pt-0"
        >
          <template #label>
            <span>
              Show Pell Grant Recipients Only&nbsp;
            </span>
          </template>
        </v-checkbox>
      </v-col>  
    </v-row>

    <div>
      <div>
        <p class="outcomes_intro d-inline-block mb-2">Show data for students who</p>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="enroll == 'enroll_first_time' ? 'secondary-green' : null"
          @click="updateSankey({ enroll: 'enroll_first_time' })"
        >
          started college here
        </v-btn>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="enroll == 'enroll_not_first_time' ? 'secondary-green' : null"
          @click="updateSankey({ enroll: 'enroll_not_first_time' })"
        >
          transferred in
        </v-btn>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="enroll == 'enroll_both' ? 'secondary-green' : null"
          @click="updateSankey({ enroll: 'enroll_both' })"
        >
          both
        </v-btn>
      </div>
      <div>
        <p class="outcomes_intro d-inline-block">and started their studies</p>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="study == 'study_full_time' ? 'secondary-green' : null"
          @click="updateSankey({ study: 'study_full_time' })"
        >
          full-time
        </v-btn>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="study == 'study_part_time' ? 'secondary-green' : null"
          @click="updateSankey({ study: 'study_part_time' })"
        >
          part-time
        </v-btn>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="study == 'study_both' ? 'secondary-green' : null"
          @click="updateSankey({ study: 'study_both' })"
        >
          both
        </v-btn>
      </div>
    </div>

    <div v-if="schools">
      <CompareSchoolsDataSection :institutions="schools">
        <template #data="{ institution }">
          <div v-show="institutionData[institution.id]?.has_data" class="om_visualization">
            <div class="om_group">
              Out of {{ toNumber(getGroupCount(institution)) }} students...
            </div>
            <div>
              <div v-for="(row, index) in getCurrentData(institution)" :key="index">
                {{ row }}
              </div>
            </div>
          </div>

          <div v-show="!institutionData[institution.id]?.has_data" class="data-na">
            <div class="om_sankey na">Data not available.</div>
          </div>
        </template>
      </CompareSchoolsDataSection>
    </div>

    <div v-else-if="school">
      <div v-show="has_data" class="om_visualization">
        <div class="om_group">
          Out of {{ toNumber(group_count) }} students...
        </div>
        <div>
          {{ currentData }}
        </div>
      </div>

      <div v-show="!has_data" class="data-na">
        <div class="om_sankey na">Data not available.</div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const analytics = useAnalytics()

const props = defineProps({ school: Object, schools: Array, showPellOnly: Boolean })
const enroll = ref("enroll_both")
const study = ref("study_both")
const showPellOnly = ref(false)
const outcomes = ref(null)
const outcome_cohorts = ref(null)
const has_data = ref(true)
const institutionData = ref({})

const { toNumber } = useNumberFormatter()

const group_count = computed(() => {
  return useGet(outcome_cohorts.value, study.value + "." + enroll.value)
})

const getGroupCount = (institution) => {
  const cohorts = institutionData.value[institution.id]?.outcome_cohorts
  return useGet(cohorts, study.value + "." + enroll.value)
}

const getCurrentData = (institution) => {
  const data = useGet(
    institutionData.value[institution.id]?.outcomes,
    links[study.value][enroll.value].variable
  )

  const rows = []
  let percent

  for (let dataPoint in data) {
    percent = Math.round(data[dataPoint] * 100)
    if (percent > 0) {
      rows.push(percent + "% " + friendlyMetrics[dataPoint])
    }
  }

  institutionData.value[institution.id] = {
    ...institutionData.value[institution.id],
    has_data: rows.length > 0
  }

  return rows
}

const currentData = computed(() => {
  const data = useGet(
    outcomes.value,
    links[study.value][enroll.value].variable
  )

  const rows = []
  let percent

  for (let dataPoint in data) {
    percent = Math.round(data[dataPoint] * 100)
    if (percent > 0) {
      rows.push(percent + "% " + friendlyMetrics[dataPoint])
    }
  }

  has_data.value = rows.length > 0

  return rows
})

const updateSankey = (options = {}) => {
  if (options.study) { study.value = options.study }
  if (options.enroll) { enroll.value = options.enroll }

  analytics.trackOutcome(
    `${enroll.value.substring(7).replace(/_/g, " ")} ${study.value.substring(6).replace(/_/g, " ")}`
  )
}

const extractInstitutionData = (institution) => {
  const outcomes = useGet(
    institution,
    showPellOnly.value ? "latest.completion.outcome_percentage_pell_suppressed" : "latest.completion.outcome_percentage_suppressed"
  )

  let outcome_cohort_data = useGet(
    institution,
    showPellOnly.value ? "latest.completion.outcome_cohort_pell" : "latest.completion.outcome_cohort"
  )

  let subgroup = "8yr_pooled"
  if (showPellOnly.value)
    subgroup = "8yr_pooled"

  const institutionCohorts = {
    study_full_time: {
      enroll_first_time:
        outcome_cohort_data.full_time.first_time[subgroup],
      enroll_not_first_time:
        outcome_cohort_data.full_time.not_first_time[subgroup],
      enroll_both:
        outcome_cohort_data.full_time.first_time[subgroup] +
        outcome_cohort_data.full_time.not_first_time[subgroup],
    },
    study_part_time: {
      enroll_first_time:
        outcome_cohort_data.part_time.first_time[subgroup],
      enroll_not_first_time:
        outcome_cohort_data.part_time.not_first_time[subgroup],
      enroll_both:
        outcome_cohort_data.part_time.first_time[subgroup] +
        outcome_cohort_data.part_time.not_first_time[subgroup],
    },
    study_both: {
      enroll_first_time:
        outcome_cohort_data.full_time.first_time[subgroup] +
        outcome_cohort_data.part_time.first_time[subgroup],
      enroll_not_first_time:
        outcome_cohort_data.full_time.not_first_time[subgroup] +
        outcome_cohort_data.part_time.not_first_time[subgroup],
      enroll_both:
        outcome_cohort_data.full_time.first_time[subgroup] +
        outcome_cohort_data.full_time.not_first_time[subgroup] +
        outcome_cohort_data.part_time.first_time[subgroup] +
        outcome_cohort_data.part_time.not_first_time[subgroup],
    },
  }

  institutionData.value[institution.id] = {
    outcomes,
    outcome_cohorts: institutionCohorts,
    has_data: true
  }
}

watch(() => showPellOnly.value, (newVal) => {
  if (props.school) {
    extractData(props.school)
  } else if (props.schools) {
    props.schools.all.forEach(institution => {
      extractInstitutionData(institution)
    })
  }
})

onMounted(() => {
  if (props.school) {
    extractData(props.school)
  } else if (props.schools) {
    props.schools.all.forEach(institution => {
      extractInstitutionData(institution)
    })
  }
})

const extractData = (school) => {
  outcomes.value = useGet(
    school,
    showPellOnly.value ? "latest.completion.outcome_percentage_pell_suppressed" : "latest.completion.outcome_percentage_suppressed"
  )

  let outcome_cohort_data = useGet(
    school,
    showPellOnly.value ? "latest.completion.outcome_cohort_pell" : "latest.completion.outcome_cohort"
  )

  let subgroup = "8yr_pooled"
  if (showPellOnly.value)
    subgroup = "8yr_pooled"

  outcome_cohorts.value = {
    study_full_time: {
      enroll_first_time:
        outcome_cohort_data.full_time.first_time[subgroup],
      enroll_not_first_time:
        outcome_cohort_data.full_time.not_first_time[subgroup],
      enroll_both:
        outcome_cohort_data.full_time.first_time[subgroup] +
        outcome_cohort_data.full_time.not_first_time[subgroup],
    },
    study_part_time: {
      enroll_first_time:
        outcome_cohort_data.part_time.first_time[subgroup],
      enroll_not_first_time:
        outcome_cohort_data.part_time.not_first_time[subgroup],
      enroll_both:
        outcome_cohort_data.part_time.first_time[subgroup] +
        outcome_cohort_data.part_time.not_first_time[subgroup],
    },
    study_both: {
      enroll_first_time:
        outcome_cohort_data.full_time.first_time[subgroup] +
        outcome_cohort_data.part_time.first_time[subgroup],
      enroll_not_first_time:
        outcome_cohort_data.full_time.not_first_time[subgroup] +
        outcome_cohort_data.part_time.not_first_time[subgroup],
      enroll_both:
        outcome_cohort_data.full_time.first_time[subgroup] +
        outcome_cohort_data.full_time.not_first_time[subgroup] +
        outcome_cohort_data.part_time.first_time[subgroup] +
        outcome_cohort_data.part_time.not_first_time[subgroup],
    },
  }
}

const links = {
  study_full_time: {
    enroll_first_time: {
      variable: "full_time.first_time.8yr",
      text: "Out of students who started college here and started their studies full-time...",
    },
    enroll_not_first_time: {
      variable: "full_time.not_first_time.8yr", 
      text: "Out of students who transferred in and started their studies full-time...",
    },
    enroll_both: {
      variable: "full_time.8yr",
      text: "Out of students who started their studies full-time...",
    },
  },
  study_part_time: {
    enroll_first_time: {
      variable: "part_time.first_time.8yr",
      text: "Out of students who started college here and started their studies part-time...",
    },
    enroll_not_first_time: {
      variable: "part_time.not_first_time.8yr",
      text: "Out of students who transferred in and started their studies part-time...",
    },
    enroll_both: {
      variable: "part_time.8yr",
      text: "Out of students who started their studies part-time...",
    },
  },
  study_both: {
    enroll_first_time: {
      variable: "first_time.8yr",
      text: "Out of students who started college here...",
    },
    enroll_not_first_time: {
      variable: "not_first_time.8yr",
      text: "Out of students who transferred in...",
    },
    enroll_both: {
      variable: "all_students.8yr",
      text: "Out of all students...",
    },
  },
}

const friendlyMetrics = {
  award_pooled: "graduated",
  still_enrolled_pooled: "still enrolled",
  transfer_pooled: "transferred",
  unknown_pooled: "withdrew",
}
</script>