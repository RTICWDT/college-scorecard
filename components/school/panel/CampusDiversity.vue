<template>
  <div class="px-0 py-3 pa-sm-5">
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card flat class="pa-4 fill-height d-flex align-center justify-center">
          <SmallSchoolIcons
            :school="school"
            :fields="fields"
            :size-only="true"
            :imgSize="40"
            :font-size="1.5"
          />
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card flat class="pa-4 text-center fill-height">
          <h2 class="text-h4 medium-light-blue-text font-weight-bold">
            {{ toNumber(undergraduates) }}
          </h2>
          <strong>Undergraduate<br />Students</strong>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card flat class="pa-4 text-center fill-height">
          <h2 class="text-h4 medium-light-blue-text font-weight-bold">
            {{ toPercent(fullTimeEnrollment) }}
          </h2>
          <strong>
            Full-time<br />Students
            <TooltipModal definition="full-time" />
          </strong>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card flat class="pa-4 text-center fill-height">
          <h2 class="text-h4 medium-light-blue-text font-weight-bold">
            {{ toPercent(partTimeEnrollment) }}
          </h2>
          <strong>Part-time<br />Students</strong>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card flat class="pa-4 fill-height">
          <h2 class="mb-3">
            Socio-Economic Diversity
            <TooltipModal definition="socio-eco" />
          </h2>
          <p class="mb-2">
            The percentage of students who received an
            income-based federal Pell grant intended for
            low-income students.
          </p>
          <div
            class="py-4"
            v-if="aidFlag < 3 && socioEconomicDiversity"
          >
            <div class='d-flex justify-center'>
              <div style="height: 250px; width: 250px;">
                <ChartDonut
                  color="secondary-blue"
                  :value="socioEconomicDiversity * 100"
                  :height="200"
                  chart-id="diversity-donut"
                />
              </div>
            </div>
            <div class="sr-only">
              Socio-Economic Diversity:
              {{ Math.round(socioEconomicDiversity * 100) + "%" }}
            </div>
          </div>
          <div v-else class="data-na">Data Not Available</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card flat class="pa-4 fill-height">
          <h2 class="mb-3">
            Student to Faculty Ratio
          </h2>
          <p class="mb-2">
            The ratio of full-time students to full-time
            instructional faculty.
          </p>
          <div v-if="studentRatio" class="text-center">
            <ChartRatio :value="studentRatio" />
            <div class="sr-only">
              Student to Faculty Ratio:
              {{ studentRatio + " to 1" }}
            </div>
          </div>
          <div v-else class="data-na">
            Data Not Available
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="pa-4 mt-4" flat>
      <v-row>
        <v-col cols="12">
          <div>
            <h2 class="mb-1 d-inline-block">
              Race/Ethnicity
              <TooltipModal definition="race-eth" />
            </h2>
            <div class="d-flex align-items-center">
              <div class="mt-4 d-inline-block float-left">
                <div class="key-box medium-blue"></div>
                Student Body
                <div class="key-box ml-3 mid-dark-blue"></div>
                Full-Time Staff
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div
            v-for="item in raceEthnicity.slice(0, 5)"
            :key="item.label"
          >
            {{ item.label }}
            <Spacer :height="10" />
            <ChartHorizontalBar
              :value="Math.round(item.value * 100)"
              :min="0"
              :max="100"
              color="secondary-blue"
              :height="30"
              :label-font-size="18"
              :labels="true"
            />
            <ChartHorizontalBar
              :value="Math.round(item.staff_value * 100)"
              :min="0"
              :max="100"
              color="primary-blue"
              :height="30"
              :label-font-size="18"
              class="mt-1 mb-4"
              :labels="true"
            />
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div
            v-for="item in raceEthnicity.slice(5, 10)"
            :key="item.label"
          >
            {{ item.label }}
            <Spacer :height="10" />
            <ChartHorizontalBar
              :value="Math.round(item.value * 100)"
              :min="0"
              :max="100"
              color="secondary-blue"
              :height="30"
              :label-font-size="18"
              :labels="true"
            />
            <ChartHorizontalBar
              :value="Math.round(item.staff_value * 100)"
              :min="0"
              :max="100"
              color="primary-blue"
              :height="30"
              :label-font-size="18"
              class="mt-1 mb-4"
              :labels="true"
            />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
const { toNumber, toPercent } = useNumberFormatter()

const props = defineProps({
  school: {
    type: Object,
    required: true,
  },
})

const {
  undergraduates: undergraduatesMethod,
  fullTimeEnrollment: fullTimeEnrollmentMethod,
  partTimeEnrollment: partTimeEnrollmentMethod,
  aidFlag: aidFlagMethod,
  socioEconomicDiversity: socioEconomicDiversityMethod,
  studentRatio: studentRatioMethod,
  raceEthnicity: raceEthnicityMethod,
} = useComplexFieldMethods()

// Computed properties
const undergraduates = computed(() => undergraduatesMethod(props.school))
const fullTimeEnrollment = computed(() => fullTimeEnrollmentMethod(props.school))
const partTimeEnrollment = computed(() => partTimeEnrollmentMethod(props.school))
const aidFlag = computed(() => aidFlagMethod(props.school))
const socioEconomicDiversity = computed(() => socioEconomicDiversityMethod(props.school))
const studentRatio = computed(() => studentRatioMethod(props.school))
const raceEthnicity = computed(() => raceEthnicityMethod(props.school))

const { fields } = useConstants()
</script>

<style lang="scss" scoped>
.medium-light-blue-text {
  color: theme-color('secondary-blue');
}

.medium-blue {
  background-color: theme-color('secondary-blue');
}

.key-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
}

.data-na {
  text-align: center;
  font-style: italic;
}
</style>