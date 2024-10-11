<template>
  <div class="pa-4 rounded-lg fos-sort-toggle-container">
    <div class="align-center d-flex">
      <span v-if="!labelPrefix" class="d-flex mr-2">{{ label }}</span>
      <v-tabs
        id="fos-sort-toggle"
        :show-arrows="true"
        @update:modelValue="$emit('tab-change', $event)"
        :height="tabsHeight"
        :style="tabContainerStyle"
        :grow="fillSpace"
        :fixed="true"
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.group"
          :value="tab.group"
          :style="tabStyle"
          :class="[{ 'tab': modelValue === tab.group }, 'fos-sort-tab']"
        >
          <slot :name="`tab-${tab.group}`">
            <span class="fos-sort-tab-title">
              {{ labelPrefix }}{{ tab.groupName }}
            </span>
          </slot>
        </v-tab>
      </v-tabs>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [
      { group: "ipeds_award_count", active: true, groupName: "Largest Size" },
      { group: "highest_earnings", active: false, groupName: "Highest Earnings" },
      { group: "lowest_debt", active: false, groupName: "Lowest Debt" },
    ],
  },
  label: {
    type: String,
    default: "Show",
  },
  displayToggle: Boolean,
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
    default: () => ({ width: "64%" }),
  },
  tabStyle: {
    type: Object,
    default: () => ({ width: "32%" }),
  },
  fillSpace: {
    type: Boolean,
    default: false,
  },
  modelValue: String,
})

const emit = defineEmits(['tab-change', 'update:modelValue'])

const selected = ref(null)
const active = ref(null)

onMounted(() => {
  // Note: Direct DOM manipulation is not recommended in Vue 3
  // Consider using refs or other Vue 3 methods if this functionality is still needed
})
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}

.fos-sort-toggle-container {
  background-color: #eff1f5 !important;
  width: 100%;
  #fos-sort-toggle {
    :deep(.median-tab-inactive) {
      border-bottom: none !important;
    }
  }
}

#fos-sort-toggle {
  :deep(.v-tab--selected) {
    background-color: #fff;
    border-radius: 10px;
  }
  #fos-sort-tab-inactive {
    border: 1px solid #707070;
    background-color: #707070;
  }

  .median-tab-active {
    span {
      font-weight: bold;
    }
  }

  :deep(.v-tab) {
    text-transform: none !important;
    background: #eff1f5;

    span {
      color: #000;
      letter-spacing: normal !important;
      font-size: 16px;
    }
  }

  :deep(.v-tab--selected) {
    font-weight: bold;
  }
  :hover {
    background: #fff !important;
  }
}

:deep(.v-tabs-bar) {
  height: 30px !important;
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