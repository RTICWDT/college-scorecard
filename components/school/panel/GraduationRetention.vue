<template>
  <div class="px-0 py-3 pa-sm-5">
    <v-row>
      <v-col cols="12" md="6" id="showPellOnlyGrad">
        <v-card flat class="pa-4 fill-height">
          <h2 class="mb-3">
            Graduation Rate&nbsp;
            <Tooltip
              definition="graduation-rate"
              :version="completionRateFieldDefinition"
              :isPell="showPellOnlyGrad"
            />
          </h2>
          <v-checkbox
            v-model="showPellOnlyGrad"
            label="Show Pell Grant Recipients Only"
            color="secondary"
            class="mt-0"
          >
            <template #label>
              <span>
                Show Pell Grant Recipients Only&nbsp;
              </span>
            </template>
          </v-checkbox>
          <v-expand-transition>
            <div v-if="!showPellOnlyGrad" class="d-none d-lg-block">
              <div class="pt-0 pb-8">
                <MedianToggle
                  :display-toggle="medianToggle"
                  @median-tab-change="handleMedianToggle"
                  :group-name="yearsText(groupName) + ' Schools'"
                />
              </div>
            </div>
          </v-expand-transition>
          <ChartHorizontalBarMedian
            v-if="
              (completionRate && !showPellOnlyGrad) ||
                (completionRatePell && showPellOnlyGrad)
            "
            :value="{
              label: showPellOnlyGrad
                ? Math.round(parseFloat(completionRatePell) * 100) + '%'
                : Math.round(parseFloat(completionRate) * 100) + '%',
              value: showPellOnlyGrad
                ? Math.round(parseFloat(completionRatePell) * 100)
                : Math.round(parseFloat(completionRate) * 100),
            }"
            :min="{
              label: '0%',
              value: 0,
              style: { height: '60px' },
            }"
            :max="{
              label: '100%',
              value: 100,
              style: { height: '60px' },
            }"
            :median="{
              label:
                'Midpoint: ' +
                numeral(medianToggle === 'group' ? computedToggleGraduationRate[0] : computedToggleGraduationRate[1]).format('0%'),
              value: medianToggle === 'group' ? computedToggleGraduationRate[0] * 100 : computedToggleGraduationRate[1] * 100,
              style: { height: '60px' },
              show: !showPellOnlyGrad,
            }"
            color="#00365e"
            :height="500"
            :y-bar-thickness="50"
            :label-font-size="24"
            :labels="true"
            class="pb-10"
          />
          <div v-else class="data-na">
            Data Not Available
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card flat class="pa-4 fill-height">
          <h2 class="mb-12">
            Students Who Return After Their First Year&nbsp;
            <Tooltip definition="retention-rate" />
          </h2>
          <div v-if="retentionRate" class="d-flex align-center justify-center">
            <div style="height: 185px; width: 185px">
              <ChartDonut
                color="#1874DC"
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
      <v-col cols="12" id="showPellOnlyOutcomes">
        <v-card flat class="pa-4">
          <v-row class="d-flex">
            <v-col cols="12" md="12">
              <h2 class="mb-0">
                Outcomes 8 Years After Attending&nbsp;
                <Tooltip
                  definition="outcome-measures"
                  :isPell="showPellOnlyOutcomes"
                />
              </h2>
              <v-checkbox
                v-model="showPellOnlyOutcomes"
                label="Show Pell Grant Recipients Only"
                color="secondary"
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

          <!-- <SankeyButtons
            @update-sankey="currentSankey = $event"
          />
          <Sankey
            :school="school"
            colors="solid"
            :currentSankey="currentSankey"
            :showPellOnly="showPellOnlyOutcomes"
          /> -->
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import numeral from 'numeral'
import { yearsText } from '~/utils/filters'

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

const { fields } = useConstants()

// Reactive state
const showPellOnlyGrad = ref(false)
const showPellOnlyOutcomes = ref(false)
const medianToggle = ref('group')

const currentSankey = reactive({
  enroll: "enroll_both",
  study: "study_both",
})


const groupName = computed(() => {
  return useGet(props.school.value, fields["PREDOMINANT_DEGREE"])
})


// Methods
const handleMedianToggle = (toggleValue) => {
  medianToggle.value = toggleValue === 0 ? "group" : "all"
}
</script>

<style lang="scss" scoped>
.data-na {
  // color: variables.$data-na-color;
}

// Add any other necessary styles here
</style>