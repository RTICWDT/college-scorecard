<template>
  <v-container class="mt-5" v-if="error">
    <v-row>
        <v-col cols="12" lg="12" class="">
          <div>
            <v-card class="pa-5" elevation="0">
              <h2 class="mb-3">Something went wrong and we couldn't find fields of study for this school.</h2>
              <p class="mb-2">Try searching for a different school by name:</p>
              <SearchSchoolAutocomplete
                @onSubmit="handleSchoolNameSelected"
                :searchEmptyName="false"
              />

              <p class="mt-6">Or <a href="mailto:scorecarddata@rti.org">contact us</a> for assistance.</p>
            </v-card>
          </div>
        </v-col>
      </v-row>
  </v-container>

  <v-main v-else>
    <div class="school-heading">
      <div class="bg-white">
        <v-container>
          <v-row class="meta-nv">
            <v-col>
              <v-btn
                variant="text"
                size="small"
                id="referrer-link"
                class="link-more"
                @click="$router.back()"
              >&laquo; Back</v-btn>
            </v-col>
            <v-col class="text-right d-flex">
              <Share
                :url="shareLink"
                :label="breakpoints.smAndDown.value ? 'Share' : 'Share these Fields of Study'"
                small
                variant="text"
                color="black"
                :elevation="3"
                :hide="['email']"
                showCopy
                class="flex-grow-1 mr-2"
              />
              <v-btn :href="schoolLink" variant="text" color="black" size="small">School Profile &raquo;</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-container class="mt-10">
        <v-row>
          <v-col class="school-lef mb-n10">
            <div class="show-loaded" id="school">
              <!-- School Header Info -->
              <v-row>
                <v-col cols="12" md="6" class="text-white">
                  <div v-if="!loading && school.id">
                    <p class="mb-3 text-uppercase">
                      All Fields of Study Offered at
                    </p>
                    <h1 class="text-h4 mb-3 font-weight-bold">
                      {{ useGet(school, fields["NAME"], "School Name") }}
                    </h1>
                    <p class="mb-0">
                      <strong>{{ toNumber(undergraduates) }}</strong>
                      undergraduate students
                    </p>
                    <p class="">
                      <a
                        target="_blank"
                        :href="schoolUrl"
                        class="text-white"
                        @click="analytics.transitionOutboundLink($event)"
                      >
                        {{ schoolUrlDisplay }}
                        <v-icon size="x-small" class="pl-1" color="white" icon="fa:fas fa-external-link-alt" />
                      </a>
                    </p>
                    <p
                      class="mb-10"
                      v-if="useGet(school, fields['UNDER_INVESTIGATION']) == 1"
                    >
                      <v-chip color="error" label>
                        <strong>Under ED Monitoring</strong>
                        <TooltipModal
                          definition="hcm2"
                          color="white"
                          class="ml-2"
                          :isBranch="isBranch"
                        />
                      </v-chip>
                    </p>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card class="pa-5">
                    <h2 class="mb-6 d-inline-block">
                      Filter Fields of Study Offered
                    </h2>
                    <v-avatar color="#fec005" size="40" class="ml-3">
                      <v-icon color="black" icon="fa:fas fa-award" />
                    </v-avatar>
                    <v-text-field
                      variant="outlined"
                      label="Search Fields of Study"
                      v-model="currentTextFilter"
                      clearable
                      hide-details="auto"
                      class="mb-4"
                    />
                    <v-select
                      id="school-field-fos-degree"
                      variant="outlined"
                      v-model="currentFilter"
                      :items="filters"
                      item-title="title"
                      item-value="value"
                      label="Search Degree Type"
                      color="primary-green"
                      clearable
                      hide-details="auto"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-container class="my-10">
      <div v-if="loading || !school.id" class="show-loading">
        <h1 class="text-h6 text-center my-15">
          <v-icon color="primary-blue">fas fa-circle-notch fa-spin</v-icon>
          Loading
        </h1>
      </div>

      <v-row v-else>
        <v-col>
          <v-alert
            v-if="currentFilter === 4"
            border="start"
            density="compact"
            color="yellow-600"
            elevation="2"
            class="mb-4"
          >
            No data on the number of graduates are displayed because of
            definitional differences with other data sources. Fields of study on
            this page include undergraduate-level programs that may be
            classified as undergraduate certificates in other data sources.
          </v-alert>

          <v-alert
            v-if="currentFilter === 8"
            border="start"
            density="compact"
            color="yellow-600"
            elevation="2"
            class="mb-4"
          >
            Fields of study on this page include graduate-level programs that
            may be labeled "postbaccalaureate certificates" in other data
            sources.
          </v-alert>

          <h2 class="mb-4">{{ totalCount }} Results</h2>
          <v-expansion-panels
            v-if="!isEmpty(processedPrograms)"
            v-model="panels"
            multiple
          >
            <v-expansion-panel
              v-for="(program, index) in processedPrograms"
              :key="index"
              class=""
            >
              <v-expansion-panel-title>
                {{ useStartCase(useToLower(program.name).slice(0, -1)) }}
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-expansion-panels v-model="subpanel">
                  <v-expansion-panel
                    v-for="fos in program.fields"
                    :key="fos.code + '-' + fos.credential.level"
                  >
                    <v-expansion-panel-title>
                      <span class="school-fields-fos-degree-title">
                        {{ fos.title.replace(/\.$/, "") }} - {{ fos.credential.title }}
                      </span>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="pa-0 ma-0">
                      <ChartFieldDataExtended
                        :fos="fos"
                        :fos-salary-select-items="fosSalarySelectItems"
                        :fos-salary-select="fieldDataExtendedSalarySelect"
                        @update-salary-select="fieldDataExtendedSalarySelect = $event"
                        :fos-show-debt-prior-included.sync="fieldDataExtendedShowPrior"
                        @update-debt-show-prior="fieldDataExtendedShowPrior = $event"
                        :fields="fields"
                      />
                    </v-expansion-panel-text>

                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>

            </v-expansion-panel>
          </v-expansion-panels>

          <v-card v-else color="pa-5">
            <p class="ma-0 text-center">
              This institution does not offer any fields of study with this
              degree.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <LayoutFooterCTA />
  </v-main>
</template>

<style lang="scss" scoped>
.school-heading {
  background-color: use-theme('primary-aqua');
}
.v-expansion-panel-title--active {
  background-color: use-theme('yellow-500');
  & + .v-expansion-panel-text {
    background-color: use-theme('yellow-500');
    .v-expansion-panel-title--active {
      background-color: white;
      & + .v-expansion-panel-text {
        background-color: white;
      }
    }
  }
}
</style>

<script setup>
const { formatFieldOfStudyTitle } = useFilters()
const { toNumber } = useNumberFormatter()
const { breakpoints } = useVuetify()

const route = useRoute()
const router = useRouter()
const { fields, formMappings } = useConstants()
const { apiGet } = useApi()
const { CIP2 } = useSiteData()

const school = reactive({})
const panels = ref([])
const num_panels = ref(0)
const subpanel = ref(null)

const currentFilter = ref(null)
const currentTextFilter = ref('')
const fieldDataExtendedSalarySelect = ref('aid')
const fieldDataExtendedShowPrior = ref(false)
const fosSalarySelectItems = ref([
  { text: 'Financial Aid Recipients', value: 'aid' },
  { text: 'Pell Grant Recipients', value: 'pell' },
])
const totalCount = ref(0)

const {
  allFieldsOfStudy: allFieldsOfStudyMethod,
  schoolLink: schoolLinkMethod,
  undergraduates: undergraduatesMethod,
  schoolUrl: schoolUrlMethod,
  schoolUrlDisplay: schoolUrlDisplayMethod,
} = useComplexFieldMethods()

// Computed properties
const allFieldsOfStudy = computed(() => allFieldsOfStudyMethod(school))
const schoolLink = computed(() => schoolLinkMethod(school))
const undergraduates = computed(() => undergraduatesMethod(school))
const schoolUrl = computed(() => schoolUrlMethod(school))
const schoolUrlDisplay = computed(() => schoolUrlDisplayMethod(school))

const processedPrograms = computed(() => {
  const programs = useGet(school, 'latest.programs.cip_4_digit')
  if (!programs) return null

  const pp = {}

  programs.forEach((program) => {
    if (program.credential.level == 3) {
      program.credential.title = "Bachelor's Degree"
    }
    if (
      (!currentFilter.value || currentFilter.value === program.credential.level) &&
      (!currentTextFilter.value || program.title.match(new RegExp(currentTextFilter.value, 'ig')))
    ) {
      const twodigit = program.code.substr(0, 2)
      if (!pp[CIP2.value[twodigit]]) {
        pp[CIP2.value[twodigit]] = []
      }
      pp[CIP2.value[twodigit]].push(program)
    }
  })

  const sorted = Object.entries(pp).map(([cipTwo, fields]) => ({
    name: cipTwo,
    fields: useSortBy(fields, ['title']),
  }))

  return useSortBy(sorted, ['name'])
})

watch(processedPrograms, (newValue) => {
  if (!newValue) return

  totalCount.value = newValue.reduce((sum, category) => sum + category.fields.length, 0)
  num_panels.value = newValue.length

  if (currentTextFilter.value || currentFilter.value) {
    panels.value = [...Array(num_panels.value).keys()].map((k, i) => i)
  } else {
    panels.value = []
  }
}, { immediate: true })

const shareLink = computed(() => {
  const currentPath = route.fullPath
  const url = useRequestURL()
  const fullUrl = `${url.origin}${currentPath}`
  return encodeURI(fullUrl) || null
})

const filters = computed(() => {
  return formMappings.fosDegrees.map(degree => ({
    title: degree.label,
    value: Number(degree.value)
  }));
});

const fieldOfStudySelectItems = computed(() => {     
  if (!props.school || !allFieldsOfStudy.value) return []
  return organizeFieldsOfStudy(allFieldsOfStudy.value, CIP2.value)
})

const organizeFieldsOfStudy = (availableFieldsOfStudy4, allCip2) => {
  let pp = {}

  availableFieldsOfStudy4.forEach((program) => {
    if (program.credential.level === 3) {
      program.credential.title = "Bachelor's Degree"
    }

    let twodigit = program.code.substr(0, 2)
    if (
      useIncludes([1, 2, 3], program.credential.level) &&
      !pp[allCip2[twodigit]]
    ) {
      pp[allCip2[twodigit]] = []
    }

    if (useIncludes([1, 2, 3], program.credential.level)) {
      pp[allCip2[twodigit]].push(formatFOS(program))
    }
  })

  let sorted = []
  for (var cip2 in pp) {
    sorted.push({
      name: formatCip2Title(cip2),
      fields: useSortBy(pp[cip2], ["title"]),
    })
  }

  return useSortBy(sorted, ["name"])
}

const handleSchoolNameSelected = (school) => {
  if (typeof school == "string") {
    router.push("/search/?name=" + encodeURIComponent(school))
  } else {
    router.push(
      "/search/?name=" + encodeURIComponent(school["school.name"])
    )
  }
}

const mapFOSFromURL = () => {
  let params = route.query
  if (!params.fos_code || !params.fos_credential) return null

  let locatedFOS = useFind(allFieldsOfStudy.value, (fos) => {
    return (
      fos.code == params.fos_code &&
      fos.credential.level == params.fos_credential
    )
  })

  return locatedFOS ? formatFOS(locatedFOS) : null
}

const formatFOS = (fosObject) => {
  return {
    text: `${formatFieldOfStudyTitle(fosObject.title)} - ${fosObject.credential.title}`,
    title: fosObject.title.replace(/\.$/, ""),
    value: `${fosObject.code}.${fosObject.credential.level}`,
    code: fosObject.code,
    credential: {
      level: fosObject.credential.level,
      title: fosObject.credential.title,
    },
  }
}

watch(() => route.fullPath, () => {
  findSchool()
})

const loading = ref(false)
const error = ref(null)

const findSchool = async () => {
  const urlParams = route.query
  const schoolId = Object.keys(urlParams)[0]

  try {
    loading.value = true
    const response = await apiGet("/schools/", { id: schoolId })
    loading.value = false

    if (response.metadata.total > 1) {
      console.warn('More than one school found for ID: "' + schoolId + '"')
      return null
    }

    Object.assign(school, response.results[0])
    document.title = useGet(school, 'school.name') + ' | College Scorecard'

    const selectedFOS = mapFOSFromURL()
    if (selectedFOS) {
      currentFilter.value = parseInt(selectedFOS.credential.level, 10);
      currentTextFilter.value = selectedFOS.title
      subpanel.value = 0
    }
  } catch (err) {
    console.warn('No School found for ID: ' + schoolId)
  }
}

onMounted(() => {
  findSchool()
})
</script>