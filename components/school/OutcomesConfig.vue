<template>
  <div>
    <v-row class="d-flex">
      <v-col cols="12" md="12">
        <CompareTooltipHeader title="Outcomes 8 Years After Attending" definition="outcome-measures" :h="2" :pell="showPellOnly" />
        <v-checkbox
          :model-value="showPellOnly"
          @update:model-value="$emit('update:showPellOnly', $event)"
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
          :color="options.enroll == 'enroll_first_time' ? 'secondary-green' : null"
          @click="updateOptions({ ...options, enroll: 'enroll_first_time' })"
        >
          started college here
        </v-btn>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="options.enroll == 'enroll_not_first_time' ? 'secondary-green' : null"
          @click="updateOptions({ ...options, enroll: 'enroll_not_first_time' })"
        >
          transferred in
        </v-btn>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="options.enroll == 'enroll_both' ? 'secondary-green' : null"
          @click="updateOptions({ ...options, enroll: 'enroll_both' })"
        >
          both
        </v-btn>
      </div>
      <div>
        <p class="outcomes_intro d-inline-block">and started their studies</p>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="options.study == 'study_full_time' ? 'secondary-green' : null"
          @click="updateOptions({ ...options, study: 'study_full_time' })"
        >
          full-time
        </v-btn>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="options.study == 'study_part_time' ? 'secondary-green' : null"
          @click="updateOptions({ ...options, study: 'study_part_time' })"
        >
          part-time
        </v-btn>
        <v-btn
          class="ma-1 d-block d-sm-inline component-toggle-button"
          size="small"
          :color="options.study == 'study_both' ? 'secondary-green' : null"
          @click="updateOptions({ ...options, study: 'study_both' })"
        >
          both
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
const analytics = useAnalytics()

const props = defineProps({
  showPellOnly: {
    type: Boolean,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:showPellOnly', 'update:options'])

const updateOptions = (newOptions) => {
  emit('update:options', newOptions)
  const enrollString = newOptions.enroll.substring(7).replace(/_/g, " ");
  const studyString = newOptions.study.substring(6).replace(/_/g, " ");
  analytics.trackOutcome(`${enrollString} ${studyString}`)
}
</script>