<template>

  <div v-if="showMedian" style="max-width: 600px;">
    <Toggle
      v-model="medianToggle"
      :options="[
        { label: 'Midpoint for School Type', value: 'group', color: color('primary-green'), activeColor: 'transparent' },
        { label: 'Midpoint for All Schools', value: 'all', color: color('primary-green'), activeColor: '#transparent' },
      ]"
      backgroundColor="white"
      borderThickness="5px"
      :height="50"
    >
      <template #default="{ label }">
        <span class="compare-tab-title px-5 text-black">
          {{ label }}
        </span>
      </template>
    </Toggle>
  </div>

  <CompareTooltipHeader title="Graduation Rate" definition="graduation-rate" :h="2" class="mb-5 mt-7" />
  <v-checkbox
    v-model="showPellOnly"
    label="Show Pell Grant Recipients Only"
    color="secondary-green"
  >
    <template v-slot:label>
        Show Pell Grant Recipients Only
    </template>
  </v-checkbox>

  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <div v-if="!showPellOnly">
          <p class="text-caption text-right">
            <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ toPercent(completionRateMidpoint(institution)) || "N/A" }}</em>
          </p>
        </div>
      </template>

      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="contextualCompletionRate(institution)"
          :value="{
            label: toPercent(contextualCompletionRate(institution)),
            value: contextualCompletionRate(institution),
          }"
          :min="{
            label: '0%',
            value: 0,
            style: { height: '60px' },
          }"
          :max="{
            label: '100%',
            value: 1,
            style: { height: '60px' },
          }"
          :median="{
            label: 'Midpoint',
            value: completionRateMidpoint(institution),
            style: { height: '60px' },
            show: !showPellOnly,
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <CompareTooltipHeader title="Students Who Return After Their First Year" definition="retention-rate" :h="2" class="mb-5 mt-7" />
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="retentionRate(institution)"
          :value="{
            label: toPercent(retentionRate(institution)),
            value: retentionRate(institution),
          }"
          :min="{
            label: '0%',
            value: 0,
            style: { height: '60px' },
          }"
          :max="{
            label: '100%',
            value: 1,
            style: { height: '60px' },
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <CompareTooltipHeader title="Outcomes 8 Years After Attending" definition="outcome-measures" :h="2" class="mb-5 mt-7" :pell="showPellOnlyOutcomes" />
  <v-checkbox
    v-model="showPellOnlyOutcomes"
    label="Show Pell Grant Recipients Only"
    color="secondary-green"
  >
    <template v-slot:label>
        Show Pell Grant Recipients Only
    </template>
  </v-checkbox>

  <div class="px-0 px-md-5 mb-5">
    <SchoolOutcomes :schools="institutions" />
  </div>
</template>

<script setup>
const props = defineProps({ institutions: Object });
const { toPercent } = useNumberFormatter()
const medianToggle = ref('group')
const showMedian = computed(() => !showPellOnly.value)
const { color } = useVuetify()

const {
  completionRate,
  completionRatePell,
  toggleGraduationRate,
  retentionRate,
} = useComplexFieldMethods()

const showPellOnly = ref(false)
const showPellOnlyOutcomes = ref(false)

const contextualCompletionRate = computed(() => (institution) => {
  return showPellOnly.value ? completionRatePell(institution) : completionRate(institution)
})

const completionRateMidpoint = (institution) => {
  const completionRate = toggleGraduationRate(institution)
  return medianToggle.value === 'group' ? completionRate[0] : completionRate[1]
}

</script>

<style lang="scss" scoped>
</style>