<template>
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
</template>

<script setup>
const analytics = useAnalytics()

const props = defineProps({ 
  school: {
    type: Object,
    required: true
  }, 
  showPellOnly: Boolean,
  options: {
    type: Object,
    default: () => ({
      study: 'study_both',
      enroll: 'enroll_both',
    }),
  }
})

const outcomes = ref(null)
const outcome_cohorts = ref(null)
const has_data = ref(true)

const { toNumber } = useNumberFormatter()

const group_count = computed(() => {
  return useGet(outcome_cohorts.value, props.options.study + "." + props.options.enroll)
})

const currentData = computed(() => {
  const data = useGet(
    outcomes.value,
    links[props.options.study][props.options.enroll].variable
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

const extractData = (school) => {
  outcomes.value = useGet(
    school,
    props.showPellOnly ? "latest.completion.outcome_percentage_pell_suppressed" : "latest.completion.outcome_percentage_suppressed"
  )

  let outcome_cohort_data = useGet(
    school,
    props.showPellOnly ? "latest.completion.outcome_cohort_pell" : "latest.completion.outcome_cohort"
  )

  let subgroup = "8yr_pooled"

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

watch(() => props.showPellOnly, () => {
  extractData(props.school)
})

onMounted(() => {
  extractData(props.school)
})

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