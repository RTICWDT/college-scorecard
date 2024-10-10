<template>
  <div :class="labelPrefix ? 'median-toggle-container align-end d-flex' : 'align-end d-flex'">
    <em v-if="!labelPrefix" class="d-flex mr-2">Show Midpoint for:</em>
    <v-tabs
      v-model="localControlTab"
      class="median-toggle"
      :show-arrows="true"
      @update:modelValue="$emit('median-tab-change', $event)"
      :height="tabsHeight"
      :style="tabContainerStyle"
      :grow="fillSpace"
    >
      <v-tab
        :value="0"
        :class="tabID('group', localControlTab)"
        :style="tabStyle"
      >
        <slot name="tab-group">
          <span class="compare-tab-title">
            {{ labelPrefix }}{{ groupName }}
          </span>
        </slot>
      </v-tab>

      <v-tab
        :value="1"
        :class="tabID('all', localControlTab)"
        :style="tabStyle"
      >
        <slot name="tab-all">
          <span class="compare-tab-title">
            {{ labelPrefix }}All Schools
          </span>
        </slot>
      </v-tab>
    </v-tabs>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  displayToggle: String,
  labelPrefix: {
    type: String,
    default: "",
  },
  groupName: String,
  tabsHeight: {
    type: String,
    default: "50px",
  },
  tabContainerStyle: {
    type: Object,
    default: () => ({
      width: "64%",
    }),
  },
  tabStyle: {
    type: Object,
    default: () => ({
      width: "32%",
    }),
  },
  fillSpace: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['median-tab-change']);

const localControlTab = ref(props.displayToggle === 'group' ? 0 : 1);

watch(() => props.displayToggle, (newValue) => {
  localControlTab.value = newValue === 'group' ? 0 : 1;
});

const tabID = (context, controlTab) => {
  if (context === "group") {
    return controlTab === 0 ? "median-tab-active" : "median-tab-inactive";
  } else if (context === "all") {
    return controlTab === 1 ? "median-tab-active" : "median-tab-inactive";
  }
};
</script>

<style lang="scss" scoped>
@use 'vuetify/styles' as vuetify;

.median-toggle-container {
  border-bottom: 2px solid #dadada;
  .median-toggle {
    .median-tab-inactive {
      border-bottom: none !important;
    }
  }  
}

.median-toggle {
  .median-tab-inactive {
    border-bottom: 1px solid #707070;
  }

  .median-tab-active {
    span {
      font-weight: bold;
    }
  }

  :deep(.v-tab) {
    text-transform: none !important;

    span {
      color: #000;
      letter-spacing: normal !important;
    }
  }

  :deep(.v-tab--selected:hover) {
    background: #c4dec4 !important;
  }
}

:deep(.v-slide-group__prev) {
  display: none !important;
}

.median-tab-title {
  letter-spacing: normal !important;
  color: black !important;
  text-transform: none !important;
}
</style>