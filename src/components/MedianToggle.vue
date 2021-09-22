<template>
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

    <v-tab :id="tabID('institutions', controlTab)" :style="tabStyle">
      <slot name="tab-school">
        <h3 class="compare-tab-title">
          Median for {{groupName}} Schools
        </h3>
      </slot>
    </v-tab>

    <v-tab :id="tabID('fos', controlTab)" :style="tabStyle">
      <slot name="tab-fos">
        <h3 class="compare-tab-title pb-1">
          Median for All Schools
        </h3>
      </slot>
    </v-tab>
  </v-tabs>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";

#median-toggle-slider {
  background-color: $institution-accent-color;
}

#median-toggle {
  #median-tab-inactive {
    /*background-color: #eeeeee;*/
    border-bottom: 8px solid #dcdada;

    h3 {
      margin-bottom: -8px;
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
  font-weight: 500;
}

#median-toggle-school-active {
  background-color: #c4dec4 !important;
  h3 {
    font-weight: bold !important;
  }
}

#median-toggle-fos-active {
  background-color: #fff6dc;
  h3 {
    font-weight: bold !important;
  }
}

.median-fos-slider-gold {
  background-color: $fos-accent-color !important;
}
</style>

<script>
export default {
  props: {
    displayToggle: {
      type: String,
    },
    groupName: {
      type: String,
    },
    controlTab: {
      type: Number,
      default: 0,
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
      default: "70px",
    },
    tabContainerStyle: {
      type: Object,
      default() {
        return {
          width: "260px",
        }
      },
    },
    tabStyle: {
      type: Object,
      default() {
        return {
          width: "130px",
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
  methods: {
    tabID(context, controlTab) {
      if (context === "group") {
        return controlTab === 0
          ? "median-toggle-group-active"
          : "median-tab-inactive"
      } else if (context === "fos") {
        return controlTab === 1
          ? "median-toggle-all-active"
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
