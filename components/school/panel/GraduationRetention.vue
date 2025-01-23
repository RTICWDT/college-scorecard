<template>
  <div class="px-0 py-3 pa-sm-5">
    <v-row>
      <v-col cols="12" md="6" id="showPellOnly">
        <v-card flat class="pa-4 fill-height">
          <h2 class="mb-3">
            Graduation Rate&nbsp;
            <TooltipModal
              definition="graduation-rate"
              :version="completionRateFieldDefinition"
              :isPell="showPellOnly"
            />
          </h2>
          <v-checkbox
            v-model="showPellOnly"
            label="Show Pell Grant Recipients Only"
            class="mt-0"
          >
            <template #label>
              <span>
                Show Pell Grant Recipients Only&nbsp;
              </span>
            </template>
          </v-checkbox>
          <v-expand-transition>
            <div v-if="!showPellOnly" class="d-none d-lg-block">
              <p><em>Show Midpoint For:</em></p>
              <div style="max-width: 600px;">
                <Toggle
                  v-model="medianToggle"
                  :options="[
                    { label: `${yearsText(school)} Schools`, value: 'group', color: color('primary-green'), activeColor: 'transparent' },
                    { label: 'All Schools', value: 'all', color: color('primary-green'), activeColor: '#transparent' },
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
            </div>
          </v-expand-transition>
          <Spacer :height="10" />
          <ChartHorizontalBarRangeSimplified
            :hasData="
              (completionRate && !showPellOnly) ||
                (completionRatePell && showPellOnly)
            "
            :showMinMax="true"
            :value="{
              label: showPellOnly
                ? Math.round(parseFloat(completionRatePell) * 100) + '%'
                : Math.round(parseFloat(completionRate) * 100) + '%',
              value: showPellOnly
                ? Math.round(parseFloat(completionRatePell) * 100)
                : Math.round(parseFloat(completionRate) * 100),
            }"
            :min="{
              label: '0%',
              value: 0,
            }"
            :max="{
              label: '100%',
              value: 100,
            }"
            :midpoint="{
              label:
                'Midpoint: ' +
                toPercent(medianToggle === 'group' ? computedToggleGraduationRate[0] : computedToggleGraduationRate[1]),
              value: medianToggle === 'group' ? computedToggleGraduationRate[0] * 100 : computedToggleGraduationRate[1] * 100,
              show: !showPellOnly,
            }"
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card flat class="pa-4 fill-height">
          <h2 class="mb-12">
            Students Who Return After Their First Year&nbsp;
            <TooltipModal definition="retention-rate" />
          </h2>
          <div v-if="retentionRate" class="d-flex align-center justify-center">
            <div style="height: 185px; width: 185px">
              <ChartDonut
                color="secondary-blue"
                :value="Math.round(parseFloat(retentionRate) * 100)"
                label="Retention Rate"
              />
            </div>
          </div>
          <div v-else class="data-na">
            Data Not Available
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <SchoolOutcomesConfig v-model:showPellOnly="showPellOnly" v-model:options="options" />
          <SchoolOutcomes :showPellOnly="showPellOnly" :options="options" :school="school" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { toPercent } = useNumberFormatter()
const { yearsText } = useFilters()
const { color } = useVuetify()
const { showPellOnly, options } = useSchoolOutcomesHelper()

const props = defineProps({
  school: {
    type: Object,
    required: true,
  }
})

const {
  completionRate: completionRateMethod,
  completionRatePell: completionRatePellMethod,
  retentionRate: retentionRateMethod,
  completionRateFieldDefinition: completionRateFieldDefinitionMethod,
  toggleGraduationRate: toggleGraduationRateMethod,
} = useComplexFieldMethods()

const completionRate = computed(() => completionRateMethod(props.school))
const completionRatePell = computed(() => completionRatePellMethod(props.school))
const retentionRate = computed(() => retentionRateMethod(props.school))
const completionRateFieldDefinition = computed(() => completionRateFieldDefinitionMethod(props.school))
const computedToggleGraduationRate = computed(() => toggleGraduationRateMethod(props.school))

const medianToggle = ref('group')
</script>