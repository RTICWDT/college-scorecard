<template>

<div :class="labelPrefix ? 'median-toggle-container align-end flex' : 'align-end flex' ">
  <em v-if="!labelPrefix" class="d-flex  mr-2">Show Midpoint for:</em>
  <v-tabs
    class="median-toggle"
    :value="controlTab"
    :show-arrows="true"
    slider-size="8"
    @change="$emit('median-tab-change', $event)"
    :height="tabsHeight"
    :style="tabContainerStyle"
    :grow="fillSpace"
  >
    <v-tabs-slider
      class="median-toggle-slider"
      :class="{ 'median-group-slider-green': controlTab === 1 }"
    />

    <v-tab :class="tabID('group', controlTab)" :style="tabStyle">
      <slot name="tab-group">
        <span class="compare-tab-title">
          {{ labelPrefix }}{{groupName}}
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

.median-toggle-slider {
  background-color: $institution-accent-color;

}
.flex {
  display: flex;
}

.median-toggle-container {
  border-bottom: 2px solid #dadada;
  .median-toggle {
    .median-tab-inactive {
    /*background-color: #eeeeee;*/
    border-bottom: none !important;
  }
  }  
}


.median-toggle {
  .median-tab-inactive {
    /*background-color: #eeeeee;*/
    border-bottom: 1px solid #707070;
  }

  .median-tab-active {
    span {
      font-weight: bold;
    }
  }

  .v-tab {
    text-transform:none !important;

    span {
      color:#000;
      letter-spacing: normal !important;
    }
  }

  .v-tab--active:hover {
    background:#c4dec4 !important;
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
import Transition from '@/pages/school/Transition.vue'
export default {
  components: { Transition },
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
    tabsHeight: {
      type: String,
      default: "50px",
    },
    tabContainerStyle: {
      type: Object,
      default() {
        return {
          width: "64%",
        }
      },
    },
    tabStyle: {
      type: Object,
      default() {
        return {
          width: "32%",
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
