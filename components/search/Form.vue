<style lang="scss" scoped>
.search-subhead {
  color: variables.$darker-gray;
}

.v-expansion-panel {
  margin-top: 0px;
}

.v-expansion-panel:not(:last-child) {
  border-bottom: 1px solid variables.$light-gray;
}

:deep(.v-input.option-checkbox) {
  height: 30px;
}
</style>

<template>
  <v-form>
    <v-expansion-panels
      accordion
      multiple
      style="border-radius: 0"
      v-model="panels"
      class="elevation-0"
      :rounded="false"
    >
      <v-expansion-panel>
        <v-expansion-panel-title>Academic Fields</v-expansion-panel-title>
        <v-expansion-panel-text>
          <SearchFieldAutocomplete v-model="input.cip4"></SearchFieldAutocomplete>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Credential Level -->
      <v-expansion-panel>
        <v-expansion-panel-title>Degree Types</v-expansion-panel-title>
        <v-expansion-panel-text>
          <span class="search-subhead">Undergraduate</span>
          <Spacer :height="10"/>
          <v-checkbox
            density="compact"
            id="search-form-fos-degree-c"
            v-model="input.cip4_degree"
            label="Certificate"
            value="1"
            hide-details
            class="option-checkbox"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-fos-degree-a"
            v-model="input.cip4_degree"
            label="Associate's Degree"
            value="2"
            hide-details
            class="option-checkbox"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-fos-degree-b"
            v-model="input.cip4_degree"
            label="Bachelor's Degree"
            value="3"
            hide-details
            class="option-checkbox"
            @keydown.enter.prevent
          />
          <Spacer :height="20"/>
          <span class="search-subhead pt-5">Graduate</span>
          <Spacer :height="10"/>
          <v-checkbox
            density="compact"
            id="search-form-fos-degree-m"
            v-model="input.cip4_degree"
            label="Master's Degree"
            value="5"
            hide-details
            class="option-checkbox"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-fos-degree-p"
            v-model="input.cip4_degree"
            label="Post-baccalaureate Certificate"
            value="4"
            hide-details
            class="option-checkbox"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-fos-degree-d"
            v-model="input.cip4_degree"
            label="Doctoral Degree"
            value="6"
            hide-details
            class="option-checkbox"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-fos-degree-f"
            v-model="input.cip4_degree"
            label="First Professional Degree"
            value="7"
            hide-details
            class="option-checkbox"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-fos-degree-g"
            v-model="input.cip4_degree"
            label="Graduate/Professional Certificate"
            value="8"
            hide-details
            class="option-checkbox"
            @keydown.enter.prevent
          />
          <Spacer :height="20"/>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel v-if="!hideLocation">
        <v-expansion-panel-title>Location</v-expansion-panel-title>
        <v-expansion-panel-text>
          <SearchLocationInstitution
            @search-update="handleLocationSelection"
            :horizontal="false"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Graduation Rate -->
      <v-expansion-panel>
        <v-expansion-panel-title> Graduation Rate</v-expansion-panel-title>
        <v-expansion-panel-text>
          <SearchCheckRange
            id="search-form-completion-rate"
            v-model="input.completion_rate"
            :enable="utility.enable.completion_rate"
            @slider-toggle="utility.enable.completion_rate = $event"
            :min="0"
            :max="100"
            :step="5"
            appendText="%"
            andUp
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Average Annual Cost -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          Average Annual Cost </v-expansion-panel-title
        ><v-expansion-panel-text>
          <SearchCheckRange
            id="search-form-avg-net-price"
            v-model="input.avg_net_price"
            :enable="utility.enable.avg_net_price"
            @slider-toggle="utility.enable.avg_net_price = $event"
            :min="0"
            :max="100"
            :step="5"
            appendText="k"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Test Scores -->
      <v-expansion-panel>
        <v-expansion-panel-title> Test Scores</v-expansion-panel-title
        ><v-expansion-panel-text>
          <SearchCheckRange
            v-model="input.sat_math"
            id="search-form-sat-math"
            :enable="utility.enable.sat_math"
            @slider-toggle="utility.enable.sat_math = $event"
            :min="0"
            :max="800"
            :step="20"
            legend-title="SAT Math"
          />
          <SearchCheckRange
            v-model="input.sat_read"
            id="search-form-sat-read"
            :enable="utility.enable.sat_read"
            @slider-toggle="utility.enable.sat_read = $event"
            :min="0"
            :max="800"
            :step="20"
            legend-title="SAT Critical Reading"
          />
          <SearchCheckRange
            v-model="input.act"
            id="search-form-act"
            :enable="utility.enable.act"
            @slider-toggle="utility.enable.act = $event"
            :min="0"
            :max="36"
            :step="1"
            legend-title="ACT Score"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Acceptance Rate -->
      <v-expansion-panel>
        <v-expansion-panel-title>Acceptance Rate</v-expansion-panel-title>
        <v-expansion-panel-text>
          <SearchCheckRange
            v-model="input.acceptance"
            id="search-form-acceptance"
            :enable="utility.enable.acceptance"
            @slider-toggle="utility.enable.acceptance = $event"
            :min="0"
            :max="100"
            :step="5"
            appendText="%"
            andUp
          >
            <template v-slot:label>
              Acceptance Rate
            </template>
          </SearchCheckRange>
        </v-expansion-panel-text>
      </v-expansion-panel>
      
      <!-- Size -->
      <v-expansion-panel>
        <v-expansion-panel-title>Size</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox
            density="compact"
            id="search-form-size-small"
            hide-details
            v-model="input.size"
            label="Small"
            value="small"
            color="secondary"
            class="py-0 my-0"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-size-medium"
            hide-details
            v-model="input.size"
            label="Medium"
            value="medium"
            color="secondary"
            class="py-0 my-0"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-size-large"
            hide-details
            v-model="input.size"
            label="Large"
            value="large"
            color="secondary"
            class="py-0 my-0"
            @keydown.enter.prevent
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Type of School -->
      <v-expansion-panel>
        <v-expansion-panel-title>Type of School</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="search-form-type-container">
            <v-checkbox
              density="compact"
              id="search-form-type-public"
              hide-details
              v-model="input.control"
              label="Public"
              value="public"
              color="secondary"
              class="py-0 my-0"
              @keydown.enter.prevent
            />
            <v-checkbox
              density="compact"
              id="search-form-type-private"
              hide-details
              v-model="input.control"
              label="Private Nonprofit"
              value="private"
              color="secondary"
              class="py-0 my-0"
              @keydown.enter.prevent
            />
            <v-checkbox
              density="compact"
              id="search-form-type-profit"
              hide-details
              v-model="input.control"
              label="Private For-Profit"
              value="profit"
              color="secondary"
              class="py-0 my-0"
              @keydown.enter.prevent
            />
          </div> 
        </v-expansion-panel-text>
      </v-expansion-panel>
      
      <!-- Urbanicity -->
      <v-expansion-panel>
        <v-expansion-panel-title>Urbanicity</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox
            density="compact"
            id="search-form-locale-city"
            hide-details
            v-model="input.locale"
            label="City"
            value="city"
            color="secondary"
            class="py-0 my-0"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-locale-suburban"
            hide-details
            v-model="input.locale"
            label="Suburban"
            value="suburban"
            color="secondary"
            class="py-0 my-0"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-locale-town"
            hide-details
            v-model="input.locale"
            label="Town"
            value="town"
            color="secondary"
            class="py-0 my-0"
            @keydown.enter.prevent
          />
          <v-checkbox
            density="compact"
            id="search-form-locale-rural"
            hide-details
            v-model="input.locale"
            label="Rural"
            value="rural"
            color="secondary"
            class="py-0 my-0"
            @keydown.enter.prevent
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Specialized Mission -->
      <v-expansion-panel>
        <v-expansion-panel-title>Specialized Mission</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-select
            v-model="input.serving"
            id="search-form-serving"
            :items="cleanSpecializedMission"
            item-title="title"
            item-value="value"
            label="Select one"
            class="py-0 pt-4 my-0"
            color="secondary"
            clearable
            density="compact"
            aria-labelledby="specialized-mission-label"
            variant="outlined"
            @keydown.enter.prevent
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      
      <!-- Religious Affiliation -->
      <v-expansion-panel>
        <v-expansion-panel-title>Religious Affiliation</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-select
            v-model="input.religious"
            id="search-form-religous"
            :items="site.data.religious_affiliations"
            item-text="label"
            item-value="value"
            label="Select one"
            class="py-0 pt-4 my-0"
            color="secondary"
            clearable
            aria-labelledby="religions-affiliation-label"
            variant="outlined"
            density="compact"
            style="z-index: 200"
          />
        </v-expansion-panel-text> 
      </v-expansion-panel>
      
      <!-- WIOA Programs -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          WIOA Programs&nbsp;
          <Tooltip definition="wioa-participants" /> 
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox
            density="compact"
            v-model="input.dolflag"
            label="Only show schools that have Department of Labor WIOA programs"
            value="true"
            color="secondary"
            hide-details
            @keydown.enter.prevent
          /> 
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div id="search-submit-container" class="py-5" v-show="submittable">
      <v-btn color="secondary" size="large" @click="onSubmit">
        Find Schools
      </v-btn>
    </div>

    <v-btn type="submit" class="sr-only" color="secondary" size="large" @click="onSubmit">
      Find Schools
    </v-btn>
  </v-form>
</template>

<script setup>
const { site } = useSiteData()
const { location } = useLocationCheck()
const emit = defineEmits(["search-update", "search-submit"])

const props = defineProps({
  hideLocation: {
    type: Boolean,
    default: true,
  },
  initiallyOpenPanelsByIndex: {
    type: Array,
    default: () => [],
  },
  submittable: {
    type: Boolean,
    default: true,
  },
  onSearchFormReset: {
    type: Function,
    default: () => {},
  },
})

const formDefault = {
  id: null,
  state: [],
  // degree: [],
  major: "",
  region: [],
  zip: "",
  distance: 10,
  size: [],
  name: "",
  control: [], // Type
  serving: null,
  religious: null,
  completion_rate: null,
  avg_net_price: null,
  urban: [],
  cip4: "",
  cip4_degree: [],
  act: null,
  sat_math: null,
  sat_read: null,
  acceptance: null,
  lat: null,
  long: null,
  locale: [],
  search: "",
  dolflag: null,
}

const utility = reactive({
  formDefault: useCloneDeep(formDefault),
  location: null,
  enable: {
    completion_rate: false,
    avg_net_price: false,
    sat_math: false,
    sat_read: false,
    act: false,
    acceptance: false,
  },
})

const panels = ref(props.initiallyOpenPanelsByIndex)
const input = reactive(useCloneDeep(formDefault))

const cleanSpecializedMission = computed(() => {
  return useMap(site.value.data.special_designations, (title, value) => {
    return {
      title,
      value,
    }
  })
})

const groomedInput = computed(() => {
  let inputToGroom = usePickBy(input, (value, key) => {
    if (!useHas(formDefault, key)) {
      return false
    }
    if (!isEqual(value, formDefault[key])) {
      return value
    }
  })

  // Completion rate
  if (
    inputToGroom.completion_rate &&
    inputToGroom.completion_rate > 0 &&
    utility.enable.completion_rate
  ) {
    inputToGroom.completion_rate = inputToGroom.completion_rate / 100 + ".."
  } else {
    useUnset(inputToGroom, "completion_rate")
  }

  if (
    inputToGroom.avg_net_price &&
    inputToGroom.avg_net_price > 0 &&
    utility.enable.avg_net_price
  ) {
    inputToGroom.avg_net_price = ".." + inputToGroom.avg_net_price * 1000
  } else {
    useUnset(inputToGroom, "avg_net_price")
  }

  if (
    inputToGroom.sat_math &&
    inputToGroom.sat_math > 0 &&
    utility.enable.sat_math
  ) {
    inputToGroom.sat_math = ".." + inputToGroom.sat_math
  } else {
    useUnset(inputToGroom, "sat_math")
  }

  if (
    inputToGroom.sat_read &&
    inputToGroom.sat_read > 0 &&
    utility.enable.sat_read
  ) {
    inputToGroom.sat_read = ".." + inputToGroom.sat_read
  } else {
    useUnset(inputToGroom, "sat_read")
  }

  if (inputToGroom.act && inputToGroom.act > 0 && utility.enable.act) {
    inputToGroom.act = ".." + inputToGroom.act
    panels.value.push(5)
  } else {
    useUnset(inputToGroom, "act")
  }

  if (
    inputToGroom.acceptance &&
    inputToGroom.acceptance > 0 &&
    utility.enable.acceptance
  ) {
    inputToGroom.acceptance = inputToGroom.acceptance / 100 + "..1"
  } else {
    useUnset(inputToGroom, "acceptance")
  }

  // Handle edgecase for distance :(
  if (inputToGroom.zip) {
    inputToGroom.distance = input.distance
  } else {
    useUnset(inputToGroom, "distance")
  }

  if (inputToGroom.size) {}
  if (inputToGroom.control) {}
  if (inputToGroom.locale) {}
  if (inputToGroom.serving) {}
  if (inputToGroom.religious) {}
  if (inputToGroom.dolflag) {}

  return inputToGroom
})

const onSubmit = () => {
  emit("search-submit", groomedInput.value)
}

const route = useRoute()

const mapInputFromQuery = (override) => {
  // Reset form to default, Helps with processing canned search items.

  // TODO - Refactor this method. Maybe add switch.
  useMergeWith(input, override || route.query, function(
    objVal,
    newObjValue,
    key
  ) {
    if (isArray(objVal) && isString(newObjValue)) {
      return [newObjValue]
    }

    // Alter values to accommodate form inputs.
    switch (key) {
      case "completion_rate":
      case "acceptance":
        return parseFloat(newObjValue) * 100
      case "avg_net_price":
        if (parseFloat(newObjValue.substr(2)) > 1000) {
          return parseFloat(newObjValue.substr(2)) / 1000
        }
        break
      case "sat_math":
      case "sat_read":
      case "act":
        return parseFloat(newObjValue.substr(2))
    }
  })

  // TODO - Refactor to a more elegant. Loop through all utility enables, and trigger on.
  // Set Sliders as active:
  const sliders = ['completion_rate', 'avg_net_price', 'sat_read', 'sat_math', 'act', 'acceptance']
  sliders.forEach(slider => {
    if (input[slider] > 0) {
      utility.enable[slider] = true
    }
  })

  // Check if these values are set, perform side effects.
  // TODO - Remove values that cannot exist at the same time.
  if (input.lat && input.long) {
    utility.location = "Near Me"
    location.latLon = true
  }

  if (input.zip) {
    utility.location = "ZIP Code"
  }

  if (!isEmpty(input.state)) {
    utility.location = "State"
  }

  if (input.name !== "") {
    input.search = input.name
    input.name = ""
  }
}

const resetForm = () => {
  Object.assign(input, useCloneDeep(formDefault))
  utility.enable = useCloneDeep(utility.formDefault)
  location.latLon = null
  location.error = null
  utility.location = null
}

const handleLocationSelection = (params) => {
  Object.assign(input, { ...input, ...params })
  input.page = 1
}

const autoOpenActivePanels = (reset) => {
  if (reset) {
    panels.value = []
  }

  Object.keys(groomedInput.value).forEach((key) => {
    switch (key) {
      case 'cip4': panels.value.push(0); break;
      case 'cip4_degree': panels.value.push(1); break;
      case 'completion_rate': panels.value.push(2); break;
      case 'avg_net_price': panels.value.push(3); break;
      case 'sat_math': panels.value.push(4); break;
      case 'sat_read': panels.value.push(4); break;
      case 'act': panels.value.push(4); break;
      case 'acceptance': panels.value.push(5); break;
      case 'size': panels.value.push(6); break;
      case 'control': panels.value.push(7); break;
      case 'locale': panels.value.push(8); break;
      case 'serving': panels.value.push(9); break;
      case 'religious': panels.value.push(10); break;
      case 'dolflag': panels.value.push(11); break;
    }
  })
}

// we run outside of mounted so panels are set before the form is rendered
mapInputFromQuery()
autoOpenActivePanels()

onMounted(() => {
  emit("search-update", { ...groomedInput.value, page: 0 })
})

watch(groomedInput, (newValue, oldValue) => {
  if (isEqual(newValue, oldValue)) { return }
  emit("search-update", { ...groomedInput.value, page: 0 })
}, { deep: true })

defineExpose({
  resetForm,
  mapInputFromQuery,
  autoOpenActivePanels,
})
</script>
