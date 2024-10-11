<template>
  <v-row class="py-2 results-card" :class="isLoading && 'loading'">
    <!-- COLUMN 1 -->
    <v-col cols="12" md="4">
      <div class='d-flex align-center'>
        <h2 class='flex-grow-1'>
          <NuxtLink class="nameLink mb-2" :to="dynamicLink">{{ schoolName }}</NuxtLink>
        </h2>
        <div :key="`${institution.id}-${fos.title}`">
          <v-tooltip :disabled="isLoading" location="right">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                @click="!isLoading ? store.toggleFieldOfStudy(fos) : () => {}"
                :class="isSelected ? '' : totalFieldOfStudyCount > 9 ? 'noCompareAllow' : ''"
                icon
              >
                <v-icon :color="isSelected ? '#0075B2' : 'grey'" icon="fa:fa fa-check-circle"></v-icon>
                <span class="sr-only">Compare</span>
              </v-btn>
            </template>
            <div class="hover-tip">{{ isSelected ? 'Added to Compare' : compareFOSHoverCountText }}</div>
          </v-tooltip>
        </div>
      </div>

      <p>{{ city }}, {{ state }} {{ zip }}</p>
      <SmallSchoolIcons :school="school" :fields="fields" size="small" fos />

      <p v-if="underInvestigation === 1">
        <v-card color="error" class="px-2 py-1" variant="flat">
          <strong class="text-white">Under ED Monitoring</strong>
          <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
        </v-card>
      </p>
    </v-col>

    <!-- COLUMN 2 -->
    <v-col cols="12" sm="6" md="3">
      <div class="cell">
        <div class="text-uppercase d-flex align-center">
          <span class='mb-2'>Median Earnings</span>
          <tooltip :definition="'fos-median-earnings'" :is-branch="isBranch" />
        </div>

        <div v-if="medianEarnings">
          <span class="display-2 text-navy font-weight-bold" :class="showSidebar && 'callout-text'">
            {{ numeral(medianEarnings).format("$0,0") }}
          </span>
          <div style="max-width: 160px; height: 30px">
            <ChartHorizontalBar
              :value="medianEarnings"
              color="#1874DC"
              bgcolor="#DFE6F0"
              :height="15"
              type="currency"
              :labels="false"
              :y-bar-thickness="10"
              :max="100_000"
              :min="0"
            />
            <span>0k</span><span class="float-right">100k</span>
          </div>
        </div>
        <div v-else class="mini-data-na text-center">Data Not Available</div>
      </div>

      <div class="cell">
        <div class="text-uppercase d-flex align-center">
          <span class='mb-2'>Monthly Earnings</span>
          <tooltip :definition="'fos-monthly-earnings'" :is-branch="isBranch" />
        </div>



        <div v-if="medianEarnings">
          <span class="display-2 text-navy font-weight-bold" :class="showSidebar && 'callout-text'">
            {{ numeral(medianEarnings / 12).format("$0,0") }}
          </span>
        </div>
        <div v-else class="mini-data-na text-center">Data Not Available</div>
      </div>

    </v-col>

    <!-- COLUMN 3 -->
    <v-col cols="12" sm="6" md="3">
      <div class="cell">
        <div class="text-uppercase d-flex align-center">
          <span class='mb-2'>Median Debt</span>
          <tooltip
            :definition="'fos-median-debt'"
            :is-branch="isBranch"
            class="ml-1"
          />
        </div>

        <div v-if="medianDebt">
          <span class="display-2 text-navy font-weight-bold" :class="showSidebar && 'callout-text'">
            {{ numeral(medianDebt).format("$0,0") }}

          </span>
          <div style="max-width: 160px; height: 30px">
            <ChartHorizontalBar
              :value="medianDebt"
              color="#1874DC"
              bgcolor="#DFE6F0"
              :height="15"
              type="currency"
              :labels="false"
              :y-bar-thickness="10"
              :max="100_000"
              :min="0"
            />
            <span>0k</span><span class="float-right">100k</span>
          </div>
        </div>
        <div v-else class="mini-data-na text-center">Data Not Available</div>
      </div>

      <div class="cell">
        <div class="text-uppercase d-flex align-center">
          <span class='mb-2'>Monthly Loan Payment</span>
          <tooltip
            :definition="'fos-monthly-debt-payment'"
            :is-branch="isBranch"
            class="ml-1"
          />
        </div>
        <div v-if="medianDebtMonthly">
          <span class="display-2 text-navy font-weight-bold" :class="showSidebar && 'callout-text'">
            {{ numeral(medianDebtMonthly).format("$0,0") }}
          </span>
        </div>
        <div v-else class="mini-data-na text-center">Data Not Available</div>
      </div>

    </v-col>


    <v-col cols="12" sm="6" md="2">
      <div class="cell">
        <div class="text-uppercase d-flex align-center">
          <div class='mb-2'>
            <span class="position-relative">Graduates</span>
          </div>
          <!-- Mock icon to match other cells -->
          <div class="d-inline-block" style="width: 32px; height: 32px;" /> 
        </div>
        <div v-if="gradCount">
          <span class="display-2 text-navy font-weight-bold" :class="showSidebar && 'callout-text'">
            {{ numeral(gradCount).format("0,0") }}
          </span>
        </div>
        <div v-else class="mini-data-na text-center">Data Not Available</div>
      </div>
    </v-col>
  </v-row>


</template>

<script setup>
import numeral from "numeral";
const { fields, getNestedField } = useConstants();
const store = useCompareStore();

const props = defineProps({
  fos: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  showSidebar: {
    type: Boolean,
    default: false,
  },
});

const school = ref(useMerge(props.fos.institution, props.fos.institution.school));
const isSelected = computed(() =>  store.fos.find((fos) => fos.id === props.fos.unit_id));

const {
  zip,
  city,
  state,
  schoolName,
  schoolLink,
  fieldsLink,
  isBranch,
  underInvestigation,
} = useComplexFields(school);

const institution = computed(() => props.fos.institution);
const totalFieldOfStudyCount = computed(() => store.fos.length);

const compareFOSHoverCountText = computed(() => {
  return totalFieldOfStudyCount.value > 9
    ? "Maximum of 10 Fields of Study Reached"
    : "Add Field of Study to Compare";
});

const dynamicLink = computed(() => {
  const baseLink =
    props.fos.credential.level <= 3 ? schoolLink.value : fieldsLink.value;
  return `${baseLink}&fos_code=${props.fos.code}&fos_credential=${props.fos.credential.level}`;
});

const medianEarnings = computed(() => getNestedField(props.fos, fields.FOS_EARNINGS_FED_5YR))
const medianDebt = computed(() => getNestedField(props.fos, fields.FOS_DEBT_MEDIAN))
const medianDebtMonthly = computed(() => getNestedField(props.fos, fields.FOS_DEBT_MONTHLY))
const gradCount = computed(() => getNestedField(props.fos, fields.FOS_GRAD_COUNT))
</script>

<style lang="scss" scoped>
.callout-text {
  @include md {
    font-size: 1rem !important;
  }
}

.loading {
  opacity: 0.6;
  filter: blur(1px);
}

.nameLink {
  text-decoration: none;
  line-height: 125%;
  &:hover {
    text-decoration: underline;
  }
}

.results-card {
  transition: opacity 0.3s;
}

.text-uppercase {
  font-size: 12px;
}
.display-2 {
  display: block;
  margin-bottom: 5px;
}
.cell {
  min-height: 100px;
  margin-bottom: 10px;
}
@media screen and (max-width: 576px) {
  .cell {
    min-height: auto;
    margin-bottom: 0;
  }
}
</style>
