<template>

<div :class="labelPrefix ? 'median-toggle-container align-end flex' : 'align-end flex' ">
  <span v-if="!labelPrefix" class="d-flex  mr-2">{{ label }}</span>
  <v-tabs
    id="median-toggle"
    :show-arrows="true"
    slider-size="8"
    @change="$emit('tab-change', $event)"
    :height="tabsHeight"
    :style="tabContainerStyle"
    :grow="fillSpace"
  >
    <v-tabs-slider
      id="median-toggle-slider"
      class="median-group-slider-green"
    />

    <v-tab 
      v-for="tab in tabs"
      :id="tab.group" :style="tabStyle" :class="tab.active">
      <slot name="tab-{{tab.group}}">
        <span class="compare-tab-title">
          {{ labelPrefix }}{{tab.groupName}}
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
.flex {
  display: flex;
}

.median-toggle-container {
  border-bottom: 2px solid #dadada;
  #median-toggle {
    #median-tab-inactive {
    /*background-color: #eeeeee;*/
    border-bottom: none !important;
  }
  }  
}


#median-toggle {
  #median-tab-inactive {
    /*background-color: #eeeeee;*/
    border-bottom: 1px solid #707070;
  }

  #median-tab-active {
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
      default: "Show"
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

    },  
  methods: {

  },
  mounted() {
    // Hacky way to remove the pagination slider arrows.
    // document.querySelector('#context-toggle .v-slide-group .v-slide-group__prev').remove();
    // document.querySelector('#context-toggle .v-slide-group .v-slide-group__next').remove();
  },
}
</script>
