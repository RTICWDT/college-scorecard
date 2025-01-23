<template>
  <div class="bg-tertiary-yellow field-of-study-search">
    <Spacer :height="15" />
    <div class="mb-4 mx-n11">
      <SchoolPanelFieldOfStudySelect
        :cip-two-nested-cip-four="fieldOfStudySelectItems"
        v-model="selectedFieldOfStudy"
        @update:model-value="handleFieldOfStudySelect"
        @input-clear="handleFieldOfStudyClear"
        container-id="field-of-study-select-search-container2"
        result-id="field-of-study-select-search-result2"
      />
    </div>
  </div>

  <div class="px-3 px-md-11 pb-11">
    <ChartFieldDataExtended
      v-if="selectedFieldOfStudyDetail"
      :fos="selectedFieldOfStudyDetail"
      :fos-salary-select-items="fosSalarySelectItems"
      :fos-salary-select="fieldDataExtendedSalarySelect"
      @update-salary-select="fieldDataExtendedSalarySelect = $event"
      :fos-show-debt-prior-included.sync="fieldDataExtendedShowPrior"
      @update-debt-show-prior="fieldDataExtendedShowPrior = $event"
      :fields="fields"
    />
    <v-row>
      <v-col>
        <!-- Top Fields of Study -->
        <v-card flat class="pa-4">
          <h2 class="mb-3">
            Top Fields of Study at {{ schoolName }}
            <TooltipModal definition="field-of-study" />
          </h2>

          <p class="my-3" v-if="fieldsOfStudy.length">
            Out of
            {{ toNumber(fosUndergradCount) }} undergraduate
            {{ fosUndergradCount == 1 ? "field" : "fields" }}
            of study at {{ schoolName }}, the
            {{
              fieldsOfStudy.length < 10
                ? fieldsOfStudy.length
                : 10
            }}
            {{ hoistGroupText }} are shown below. ({{
              hoistCount
            }}
            had relevant data on {{ hoistGroupData }}.)
            <a :href="fieldsLink"
              >See All Fields of Study &raquo;</a
            >
          </p>

          <SchoolPanelFieldOfStudyToggle
            :display-toggle="true"
            :control-tab="fieldSort"
            @tab-change="handleToggle"
            class="pt-2 pb-2"
          />

          <v-row
            class="mx-5 mt-5 d-none d-sm-flex"
            v-if="fieldsOfStudy.length"
          >
            <v-col
              cols="12"
              sm="8"
              class="ma-0 px-2 pt-0 pb-3 font-weight-bold"
              >Field of Study</v-col
            >
            <v-col
              cols="12"
              sm="4"
              class="ma-0 pa-0 font-weight-bold"
              >{{ currentHoist }}</v-col
            >
          </v-row>

          <v-row
            class="mx-0 mt-5 d-block d-sm-none"
            v-if="fieldsOfStudy.length"
          >
            <v-col
              cols="12"
              class="ma-0 px-2 py-2 font-weight-bold"
              >Field of Study ({{ currentHoist }})</v-col
            >
          </v-row>

          <v-expansion-panels
            class="my-3"
            v-if="fieldsOfStudy.length"
          >
            <v-expansion-panel
              v-for="fos in fieldsOfStudy"
              :key="fos.code + '-' + fos.credential.level"
            >
              <v-expansion-panel-title
                class="py-0 pl-2 pl-sm-4"
              >
                <v-row
                  no-gutters
                  class="my-0 d-none d-sm-flex"
                  align="center"
                >
                  <v-col cols="12" sm="8" class="pa-2"
                    >{{ fos.title.slice(0, -1) }} -
                    {{ fos.credential.title }}</v-col
                  >
                  <v-col
                    v-if="hoistCurrency"
                    cols="12"
                    class="medium-light-blue-text px-5 font-weight-bold"
                    sm="4"
                    >{{ toDollar(fos.hoist) }}</v-col
                  >
                  <v-col
                    v-else
                    cols="12"
                    class="medium-light-blue-text px-5 font-weight-bold"
                    sm="4"
                    >{{ toNumber(fos.hoist) }}</v-col
                  >
                </v-row>
                <div class="d-block d-sm-none my-2 mx-1 pl-0">
                  {{ fos.title.slice(0, -1) }} -
                  {{ fos.credential.title }}
                  <span
                    v-if="hoistCurrency"
                    class="medium-light-blue-text font-weight-bold"
                    >({{ toDollar(fos.hoist) }})</span
                  >
                  <span
                    v-else
                    class="medium-light-blue-text font-weight-bold"
                    >({{ toNumber(fos.hoist) }})</span
                  >
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <ChartFieldDataExtended
                  :fos="fos"
                  :fos-salary-select="fieldDataExtendedSalarySelect"
                  :fos-salary-select-items="fosSalarySelectItems"
                  @update-salary-select="fieldDataExtendedSalarySelect = $event"
                  :fos-show-debt-prior-included.sync="fieldDataExtendedShowPrior"
                  @update-debt-show-prior="fieldDataExtendedShowPrior = $event"
                  :fields="fields"
                  class="mt-5"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <div v-else>
            <v-alert type="info" class="mt-3"
              >There are no fields of study with data
              available for {{ currentHoist }}.</v-alert
            >
          </div>
        </v-card></v-col
      ></v-row
    >
    <v-row>
      <v-col cols="12">
        <v-card flat class="pa-4 fill-height">
          <h2 class="mb-3">
            Awards Offered
          </h2>
          <p>
            {{ schoolName }} awards {{ schoolDegreeList }}.
          </p>
          <p class="text-left my-8">
            <v-btn
              color="secondary-green"
              :href="fieldsLink"
            >
              See All Available Fields of Study
            </v-btn>
          </p>
          <div class="pa-4 rounded bg-yellow-800 mt-4 mb-8">
            <strong>Note: </strong>These data were collected
            from undergraduate students who received federal
            financial aid.
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { toDollar, toNumber } = useNumberFormatter()

const {
  formatFieldOfStudyTitle,
  formatCip2Title,
} = useFilters()

const route = useRoute()
const router = useRouter()

const props = defineProps({
  school: {
    type: Object,
    required: true,
  },
})

const {
  allFieldsOfStudy: allFieldsOfStudyMethod,
  fieldsLink: fieldsLinkMethod,
  schoolDegreeList: schoolDegreeListMethod,
  schoolName: schoolNameMethod,
} = useComplexFieldMethods()

const allFieldsOfStudy = computed(() => allFieldsOfStudyMethod(props.school) )
const fieldsLink = computed(() => fieldsLinkMethod(props.school))
const schoolDegreeList = computed(() => schoolDegreeListMethod(props.school))
const schoolName = computed(() => schoolNameMethod(props.school))

const emit = defineEmits(['update:selectedFieldOfStudy']);


const formatFOS = (fosObject) => {
  return {
    text: `${formatFieldOfStudyTitle(fosObject.title)} - ${fosObject.credential.title}`,
    value: fosObject,
    code: fosObject.code,
    credential: {
      level: fosObject.credential.level,
    },
  }
}

const mapFOSFromURL = () => {
  const defaultOption = { text: "", value: null };

  if (!route.query.fos_code || !route.query.fos_credential) {
    return defaultOption;
  }

  let locatedFOS = useFind(allFieldsOfStudy.value, (fos) => {
    return (
      fos.code == route.query.fos_code &&
      fos.credential.level == route.query.fos_credential
    )
  })

  return locatedFOS ? formatFOS(locatedFOS) : null
}

const selectedFieldOfStudy = reactive(mapFOSFromURL())
const { fields } = useConstants()
const { CIP2 } = useSiteData()

const hoistCurrency = ref(false)
const hoistGroupData = ref("numer of graduates")
const hoistGroupText = ref("largest")
const hoistCount = ref(0)
const fieldSort = ref("ipeds_award_count")
const fieldTabs = [
  {
    group: "ipeds_award_count",
    active: true,
    groupName: "Largest Size",
  },
  {
    group: "highest_earnings",
    active: false,
    groupName: "Highest Earnings",
  },
  {
    group: "lowest_debt",
    active: false,
    groupName: "Lowest Debt",
  },
]

const fieldDataExtendedSalarySelect = ref("aid")
const fieldDataExtendedShowPrior = ref(false)
const fosSalarySelectItems = ref([
  { text: "Financial Aid Recipients", value: "aid" },
  { text: "Pell Grant Recipients", value: "pell" },
])

const fieldsOfStudy = computed(() => {
  let fos = allFieldsOfStudy.value
  if (!fos) {
    return []
  } else if (fos.length) {
    for (let q = 0; q < fos.length; q++) {
      fos[q].ipeds_award_count = useGet(fos[q], fields["FOS_GRAD_COUNT"])
      fos[q].highest_earnings = useGet(fos[q], fields["FOS_EARNINGS_FED_5YR"])
      fos[q].lowest_debt = useGet(fos[q], fields["FOS_DEBT_MEDIAN"])
      fos[q].hoist = fos[q][fieldSort.value]
    }
    fos = fos.filter((field) => field.credential.level <= 3 && field.hoist)

    fos = useSortBy(fos, [
      function(o) {
        return o[fieldSort.value]
      },
    ])
    if (["ipeds_award_count", "highest_earnings"].indexOf(fieldSort.value) >= 0) {
      fos.reverse()
    }
    // Note: This might need to be handled differently as it's mutating state
    hoistCount.value = fos.length
    fos = fos.slice(0, 5)
  } else {
    fos = [fos]
  }

  return fos
})

const fieldOfStudySelectItems = computed(() => {     
  if (!props.school || !allFieldsOfStudy.value) return []
  return organizeFieldsOfStudy(allFieldsOfStudy.value, CIP2.value)
})

const currentHoist = computed(() => {
  let sort = fieldSort.value
  switch (sort) {
    case "ipeds_award_count":
      // Note: These might need to be handled differently as they're mutating state
      hoistCurrency.value = false
      hoistGroupText.value = "largest"
      hoistGroupData.value = "number of graduates"
      return "Graduates"
    case "highest_earnings":
      hoistCurrency.value = true
      hoistGroupText.value = "highest earning"
      hoistGroupData.value = "earnings"
      return "Median Earnings"
    case "lowest_debt":
      hoistCurrency.value = true
      hoistGroupText.value = "with the least amount of debt"
      hoistGroupData.value = "debt"
      return "Median Debt"
  }
})

const fosUndergradCount = computed(() => {
  if (!allFieldsOfStudy.value || allFieldsOfStudy.value.length === 0) {
    return 0
  }

  return allFieldsOfStudy.value.filter((fos) => {
    return fos.credential.level <= 3
  }).length
})

const selectedFieldOfStudyDetail = computed(() => {
  if (typeof selectedFieldOfStudy.value === 'object' && selectedFieldOfStudy.value !== null) {
    if (Object.keys(selectedFieldOfStudy.value).length === 0) {
      return null
    }
  }

  if (
    selectedFieldOfStudy.value === "" ||
    selectedFieldOfStudy.value === null
  ) {
    return null
  }

  let locatedFOS = locateFOSObject(
    allFieldsOfStudy.value,
    selectedFieldOfStudy.value.code,
    selectedFieldOfStudy.value.credential.level
  )

  return {
    title: selectedFieldOfStudy.text,
    ...locatedFOS,
  }
})

const handleFieldOfStudyClear = () => {
  selectedFieldOfStudy.value = null
}

const handleToggle = (toggleValue) => {
  fieldTabs.forEach((tab) => {
    if (tab.group === toggleValue) {
       return fieldSort.value = tab.group
    }
  })
}

const locateFOSObject = (elements, code, credentialLevel) => {
  return useFind(elements, (fos) => {
    return fos.code === code && fos.credential.level === credentialLevel
  })
}



const organizeFieldsOfStudy = (availableFieldsOfStudy4, allCip2) => {
  let processedPrograms = {}

  availableFieldsOfStudy4.forEach((program) => {
    if (program.credential.level === 3) {
      program.credential.title = "Bachelor's Degree"
    }

    let twodigit = program.code.substr(0, 2)
    if (
      useIncludes([1, 2, 3], program.credential.level) &&
      !processedPrograms[allCip2[twodigit]]
    ) {
      processedPrograms[allCip2[twodigit]] = []
    }

    if (useIncludes([1, 2, 3], program.credential.level)) {
      processedPrograms[allCip2[twodigit]].push(formatFOS(program))
    }
  })

  let sorted = []
  for (var cip2 in processedPrograms) {
    sorted.push({
      name: formatCip2Title(cip2),
      fields: useSortBy(processedPrograms[cip2], ["title"]),
    })
  }

  return useSortBy(sorted, ["name"])
}

const handleFieldOfStudySelect = (event) => {
  selectedFieldOfStudy.value = event
}

watch(() => selectedFieldOfStudy.value, (newValue) => {
  router.replace({
    query: {
      ...route.query,
      fos_code: newValue.code,
      fos_credential: newValue.credential.level,
    },
  })
})

</script>

<style lang="scss" scoped>
.field-of-study-search {
  padding: 8px 24px 16px;
  margin-bottom: 20px;
}
</style>