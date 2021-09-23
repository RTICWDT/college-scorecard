<template>
<div style="border-bottom:2px solid #dcdada;">
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
          Median for {{groupName}} Schools
        </span>
      </slot>
    </v-tab>

    <v-tab :id="tabID('all', controlTab)" :style="tabStyle">
      <slot name="tab-all">
        <span class="compare-tab-title">
          Median for All Schools
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
          width: "460px",
        }
      },
    },
    tabStyle: {
      type: Object,
      default() {
        return {
          width: "230px",
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
