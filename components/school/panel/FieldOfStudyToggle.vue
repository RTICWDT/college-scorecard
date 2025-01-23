<template>
  <div class="pa-4 rounded-lg fos-sort-toggle-container d-flex-column d-md-flex align-center">
    <span class="d-flex text-subtitle-2 mr-2 mb-1 mb-md-0">Sort by: </span>
    <div class="align-center d-flex flex-grow-1">
      <v-tabs
        id="fos-sort-toggle"
        :show-arrows="true"
        v-model="currentTab"
        @update:modelValue="$emit('tab-change', $event)"
        :height="tabsHeight"
        :style="tabContainerStyle"
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.group"
          :value="tab.group"
          :style="tabStyle"
          :class="tab.group === currentTab ? 'active' : ''"
        >
          <slot>
            <span>
              {{ tab.groupName }}
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
    default: () => ({ width: "100%" }),
  },
  tabStyle: {
    type: Object,
    default: () => ({ width: "33%" }),
  },
  fillSpace: {
    type: Boolean,
    default: false,
  },
  modelValue: String,
})

const emit = defineEmits(['tab-change', 'update:modelValue'])

const currentTab = ref(props.modelValue)

watch(() => currentTab.value, (value) => {
  currentTab.value = value
})
</script>

<style lang="scss" scoped>
.fos-sort-toggle-container {
  background-color: use-theme('gray-100') !important;
}

.active {
  background-color: white !important;
}

:deep(.v-slide-group__next, .v-slide-group__prev) {
  width: 30px;
}

:deep(.v-tab--selected .v-tab__slider) {
  opacity: 0;
}

</style>