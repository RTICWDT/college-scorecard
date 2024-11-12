<template>
  <div v-show="hasData" class="mb-4">
    <div class="font-weight-bold my-4" style="font-size: 22px;">
      Out of {{ toNumber(group_count) }} students...
    </div>
    <div v-for="datum in currentData" style="max-width: 850px;" class="ml-0 ml-lg-8">
      <div class="mb-0">{{ datum.metric }}</div>
      <div class="mb-0">
        <ChartHorizontalBarRangeSimplified
          :value="{
            label: toPercent(datum.percent),
            value: datum.percent,
          }"
          :min="{ value: 0 }"
          :max="{ value: 1 }"
        />
      </div>
    </div>
  </div>

  <div v-show="!hasData" class="data-na">Data not available.</div>
</template>

<script setup>
const { toNumber, toPercent } = useNumberFormatter()

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
const outcomeCohorts = ref(null)
const hasData = ref(true)

const group_count = computed(() => {
  return useGet(outcomeCohorts.value, props.options.study + "." + props.options.enroll)
})

const capitalize = (str) => {
    // Type check
    if (typeof str !== 'string') {
        throw new TypeError('Input must be a string');
    }
    if (str.length === 0) { return ''; }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const currentData = computed(() => {
  const data = useGet(
    outcomes.value,
    links[props.options.study][props.options.enroll].variable
  )

  const rows = []
  let percent

  for (let dataPoint in data) {
    percent = data[dataPoint]
    if (percent > 0) {
      rows.push({
        percent: percent,
        metric: capitalize(friendlyMetrics[dataPoint]),
      })
    }
  }

  hasData.value = rows.length > 0
  return rows.sort((a, b) => b.percent - a.percent)
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

  outcomeCohorts.value = {
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

const icons = {
  award_pooled: "mdi-trophy",
  still_enrolled_pooled: "mdi-school",
  transfer_pooled: "mdi-transfer",
  unknown_pooled: "mdi-close",
}
</script>