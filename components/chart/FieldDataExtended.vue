<template>
  <div class="px-0 py-3 pa-sm-5">
    <v-container class="pa-0">
      <v-row>
        <v-col cols="12" md="6">
          <v-card flat class="pa-5 fill-height">
            <h3>
              Median Earnings&nbsp;
              <Tooltip definition="fos-median-earnings" :isBranch="isBranch" />
            </h3>
            <div>
              <div v-if="medianEarnings">
                <span class="text-h4 text-primary font-weight-bold">
                  {{ numeral(medianEarnings).format("$0,0") }}
                </span>

                <ChartHorizontalBar
                  v-if="medianEarnings"
                  :value="medianEarnings"
                  :min="0"
                  :max="130000"
                  color="#1874DC"
                  bgcolor="#DFE6F0"
                  :height="25"
                  :labels="false"
                  type="currency"
                  class="mt-3"
                />
              </div>

              <div v-else class="text-center text-subtitle-1">
                Data Not Available
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card flat class="pa-5 fill-height">
            <h3>
              Median Total Debt After Graduation&nbsp;
              <Tooltip
                v-if="!fosShowDebtPriorIncluded"
                definition="fos-median-debt"
                :isBranch="isBranch"
              />
              <Tooltip
                v-else
                definition="fos-median-debt-all-schools"
                :isBranch="isBranch"
              />
            </h3>
            <div v-if="!fosShowDebtPriorIncluded">
              <div v-if="medianDebt">
                <span class="text-h4 text-primary font-weight-bold">
                  {{ numeral(medianDebt).format("$0,0") }}
                </span>

                <ChartHorizontalBar
                  v-if="medianDebt"
                  :value="medianDebt"
                  :min="0"
                  :max="100000"
                  color="#1874DC"
                  bgcolor="#DFE6F0"
                  :height="25"
                  :labels="false"
                  type="currency"
                  class="mt-3"
                />
              </div>

              <div v-else class="text-center text-subtitle-1">
                Data Not Available
              </div>
            </div>

            <div v-else>
              <div v-if="medianPrior">
                <span class="text-h4 text-primary font-weight-bold">
                  {{ numeral(medianPrior).format("$0,0") }}
                </span>
                <ChartHorizontalBar
                  v-if="medianPrior"
                  :value="medianPrior"
                  :min="0"
                  :max="100000"
                  color="#1874DC"
                  bgcolor="#DFE6F0"
                  :height="25"
                  :labels="false"
                  type="currency"
                  class="mt-3"
                />
              </div>

              <div v-else class="text-center text-subtitle-1">
                Data Not Available
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-card flat class="pa-5 fill-height">
            <h3>
              Monthly Earnings&nbsp;
              <Tooltip definition="fos-monthly-earnings" :isBranch="isBranch" />
            </h3>
            <div>
              <div v-if="medianEarnings">
                <span class="text-h4 text-primary font-weight-bold">
                  {{ numeral(medianEarnings / 12).format("$0,0") }}
                </span>
              </div>

              <div v-else class="text-center text-subtitle-1">
                Data Not Available
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card flat class="pa-5 fill-height">
            <h3>
              Monthly Loan Payment&nbsp;
              <Tooltip
                v-if="!fosShowDebtPriorIncluded"
                definition="fos-monthly-debt-payment"
                :isBranch="isBranch"
                :version="[5, 6, 7, 8].includes(fos.credential.level) ? 'graduate' : 'default'"
              />
              <Tooltip
                v-else
                definition="fos-monthly-debt-payment-all-schools"
                :isBranch="isBranch"
                :version="[5, 6, 7, 8].includes(fos.credential.level) ? 'graduate' : 'default'"
              />
            </h3>
            <div v-if="!fosShowDebtPriorIncluded">
              <div v-if="medianDebtMonthly">
                <span class="text-h4 text-primary font-weight-bold">
                  {{ numeral(medianDebtMonthly).format("$0,0") }}
                </span>
              </div>

              <div v-else class="text-center text-subtitle-1">
                Data Not Available
              </div>
            </div>

            <div v-else>
              <div v-if="medianDebtMonthlyPrior">
                <span class="text-h4 text-primary font-weight-bold">
                  {{ numeral(medianDebtMonthlyPrior).format("$0,0") }}
                </span>
              </div>

              <div v-else class="text-center text-subtitle-1">
                Data Not Available
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card flat class="pa-5 fill-height">
            <h3>
              Number of Graduates&nbsp;
              <Tooltip definition="fos-number-of-graduates" />
            </h3>

            <div v-if="gradCount != null">
              <span class="text-h4 text-primary font-weight-bold">
                {{ gradCount }}
              </span>
            </div>

            <div v-else class="text-center text-subtitle-1">
              Data Not Available
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-checkbox
            v-model="checked"
            label="Include debt borrowed at any prior institutions"
            color="secondary"
            class="mt-1 mb-4"
            hide-details
          >
            <template #label>
              <span class="profile-fos-include-prior-debt">
                Include debt borrowed at any prior institutions&nbsp;
                <Tooltip definition="include-debt-prior-inst" />
              </span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col class="text-right">
          <v-btn
            @click="toggleFieldOfStudy"
            :class="{ 'bg-secondary': isSelectedFieldOfStudy }"
          >
            Compare
            <v-icon small class="ml-1">mdi-check-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import numeral from 'numeral'
const store = useCompareStore()
const { fields, getNestedField } = useConstants()
const emit = defineEmits(['update-debt-show-prior'])

const props = defineProps({
  fos: {
    type: Object,
    required: true,
  },
  fosSalarySelectItems: {
    type: Array,
    required: true,
  },
  fosShowDebtPriorIncluded: {
    type: Boolean,
    default: false,
  },
})

const isBranch = computed(() => props.fos.school.main_campus === 0)
const medianEarnings = computed(() => getNestedField(props.fos, fields.FOS_EARNINGS_FED_5YR))
const medianDebt = computed(() => getNestedField(props.fos, fields.FOS_DEBT_MEDIAN))
const medianPrior = computed(() => getNestedField(props.fos, fields.FOS_DEBT_MEDIAN_PRIOR))
const medianDebtMonthly = computed(() => getNestedField(props.fos, fields.FOS_DEBT_MONTHLY))
const medianDebtMonthlyPrior = computed(() => getNestedField(props.fos, fields.FOS_DEBT_MONTHLY_PRIOR))
const gradCount = computed(() => getNestedField(props.fos, fields.FOS_GRAD_COUNT))

const checked = computed({
  get: () => props.fosShowDebtPriorIncluded,
  set: (value) => emit('update-debt-show-prior', value),
})

const isSelectedFieldOfStudy = computed(() => {
  return store.fos.some(
    (f) =>
      f.code === props.fos.code &&
      f.credentialLevel === props.fos.credential.level &&
      f.id === props.fos.unit_id
  )
})

const toggleFieldOfStudy = () => {
  store.toggleFieldOfStudy(props.fos)
}
</script>

<style lang="scss" scoped>
.text-primary {
  color: #1470ef !important;
}
</style>