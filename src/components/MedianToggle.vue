<template>
<div :class="labelPrefix ? 'median-toggle-container d-flex align-end' : 'd-flex align-end' ">
  <em v-if="!labelPrefix" class="d-flex  mr-2">Show median for:</em>
  <v-tabs
    id="median-toggle"
    :value="controlTab"
    :show-arrows="true"
    slider-size="8"
    @change="$emit('median-tab-change', $event)"
    :height="tabsHeight"
    :style="tabContainerStyle"
    :grow="fillSpace"
  >
    <v-tabs-slider
      id="median-toggle-slider"
      :class="{ 'median-group-slider-green': controlTab === 1 }"
    />

    <v-tab :id="tabID('group', controlTab)" :style="tabStyle">
      <slot name="tab-group">
        <span class="compare-tab-title">
          {{ labelPrefix }}{{groupName}} Schools
        </span>
      </slot>
    </v-tab>

    <v-tab :id="tabID('all', controlTab)" :style="tabStyle">
      <slot name="tab-all">
        <span class="compare-tab-title">
         {{ labelPrefix }}All Schools
        </span>
      </slot>
    </v-tab>
  </v-tabs>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";

#median-toggle-slider {
  background-color: $institution-accent-color;
}

.median-toggle-container {
  border-bottom: 2px solid #dadada;
}

.v-tab {
  text-transform:none !important;
  span {
    color:#000;
    letter-spacing: normal !important;
  }
}

#median-toggle {
  #median-tab-inactive {
    /*background-color: #eeeeee;*/
    border-bottom: 8px solid #fff;
  }

  #median-tab-active {
    span {
      font-weight: bold;
    }
  }
}

.v-slide-group__prev {
  display: none;
}

.median-tab-title {
  letter-spacing: normal !important;
  color: black !important;
  text-transform: none !important;

  
}

</style>

<script>
export default {
  props: {
    displayToggle: {
      type: String,
    },
    labelPrefix: {
      type: String,
      default: "",
    },
    groupName: {
      type: String,
    },
    compareInstitutionsCount: {
      type: Number,
      default: 0,
    },
    compareFieldsOfStudyCount: {
      type: Number,
      default: 0,
    },
    tabsHeight: {
      type: String,
      default: "50px",
    },
    tabContainerStyle: {
      type: Object,
      default() {
        return {
          width: "60%",
        }
      },
    },
    tabStyle: {
      type: Object,
      default() {
        return {
          width: "20%",
        }
      },
    },
    fillSpace: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: null,
    }
  },
  computed: {
    controlTab() {
      if (this.displayToggle == 'group')
      return 0
      else 
      return 1
    }
    },  
  methods: {
    tabID(context, controlTab) {
      if (context === "group") {
        return controlTab === 0
          ? "median-tab-active"
          : "median-tab-inactive"
      } else if (context === "all") {
        return controlTab === 1
          ? "median-tab-active"
          : "median-tab-inactive"
      }
    },
  },
  mounted() {
    // Hacky way to remove the pagination slider arrows.
    // document.querySelector('#context-toggle .v-slide-group .v-slide-group__prev').remove();
    // document.querySelector('#context-toggle .v-slide-group .v-slide-group__next').remove();
  },
}
</script>
