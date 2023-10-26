<template>
  <div class="pa-4 rounded-lg fos-sort-toggle-container">
    <div class="align-center flex">
      <span v-if="!labelPrefix" class="d-flex  mr-2">{{ label }}</span>
      <v-tabs
        id="fos-sort-toggle"
        :show-arrows="true"
        slider-size="0"
        @change="$emit('tab-change', $event)"
        :height="tabsHeight"
        :style="tabContainerStyle"
        :grow="fillSpace"
        fixed-tabs
      >
        <v-tab
          v-for="tab in tabs"
          v-bind:key="tab.group"
          :id="tab.group"
          :style="tabStyle"
          :class="[{ tab: active }, 'fos-sort-tab']"
        >
          <slot name="tab-{{tab.group}}">
            <span class="fos-sort-tab-title">
              {{ labelPrefix }}{{ tab.groupName }}
            </span>
          </slot>
        </v-tab>
      </v-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";

.flex {
  display: flex;
}

.fos-sort-toggle-container {
  background-color: #eff1f5 !important;
  width: 100%;
  #fos-sort-toggle {
    .median-tab-inactive {
      /*background-color: #eeeeee;*/
      border-bottom: none !important;
    }
  }
}

#fos-sort-toggle {
  .v-tab.v-tab--active {
    background-color: #fff;
    border-radius: 10px;
  }
  #fos-sort-tab-inactive {
    /*background-color: #eeeeee;*/
    border: 1px solid #707070;
    background-color: #707070;
  }

  .median-tab-active {
    span {
      font-weight: bold;
    }
  }

  .v-tab {
    text-transform: none !important;
    background: #eff1f5;

    span {
      color: #000;
      letter-spacing: normal !important;
      font-size: 16px;
    }
  }

  .v-tab--active {
    font-weight: bold;
  }
  :hover {
    background: #fff !important;
  }
}

.v-tabs-bar {
  height: 30px !important;
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
import Transition from "@/pages/school/Transition.vue"
export default {
  components: { Transition },
  props: {
    tabs: {
      type: Array,
      default() {
        return [
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
      },
    },
    label: {
      type: String,
      default: "Show",
    },
    displayToggle: {
      type: Boolean,
    },
    labelPrefix: {
      type: String,
      default: "",
    },
    tabsHeight: {
      type: String,
      default: "30px",
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
      active: null,
    }
  },
  computed: {},
  methods: {},
  mounted() {
    // Hacky way to remove the pagination slider arrows.
    // document.querySelector('#context-toggle .v-slide-group .v-slide-group__prev').remove();
    // document.querySelector('#context-toggle .v-slide-group .v-slide-group__next').remove();
  },
}
</script>
