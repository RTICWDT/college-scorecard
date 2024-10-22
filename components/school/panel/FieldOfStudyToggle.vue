<template>
  <div class="pa-4 rounded-lg fos-sort-toggle-container">
    <span v-if="!labelPrefix" class="d-flex text-subtitle-2">{{ label }}</span>
    <div class="align-center d-flex">
      <v-tabs
        id="fos-sort-toggle"
        :show-arrows="true"
        @update:modelValue="$emit('tab-change', $event)"
        :height="tabsHeight"
        :style="tabContainerStyle"
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
</script>

<style lang="scss" scoped>
.fos-sort-toggle-container {
  background-color: theme-color('gray-100') !important;
}

</style>