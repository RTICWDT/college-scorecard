<template>
  <v-card elevation="0" :border="0" :style="{ borderRadius: 0, width: '100%', backgroundColor }">
    <v-tabs
      v-model="localModelValue"
      :show-arrows="true"
      :style="{
        borderRadius: 0,
        borderBottom: '1px solid #dadada',
        width: '100%',
        height: `${height}px`,
      }"
      grow
    >
      <v-tab
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        :class="{ 'custom-border': localModelValue === option.value }"
        :style="{
          color: option.color,
          backgroundColor: localModelValue === option.value ? option.activeColor : 'transparent',
          borderRadius: 0,
          flex: 1,
          minWidth: 0,
          height: `${height}px`,
          lineHeight: `${height}px`,
        }"
      >
        <slot :label="option.label" :index="index" :isActive="localModelValue === option.value">
          <strong class="display-1" style="color: black; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ option.label }}
          </strong>
        </slot>
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
    validator: (value) => 
      value.every(option => 
        'label' in option && 
        'value' in option && 
        'color' in option && 
        'activeColor' in option
      )
  },
  backgroundColor: {
    type: String,
    default: 'white',
  },
  height: {
    type: [Number, String],
    default: 48,
  },
  borderThickness: {
    type: [Number, String],
    default: "4px",
  },
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = ref(props.modelValue);

watch(localModelValue, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  localModelValue.value = newValue;
});
</script>

<style scoped>
.custom-border {
  border-bottom-style: solid;
  border-bottom-color: currentColor;
}

:deep(.v-tab__slider) {
    height: v-bind(borderThickness) !important;
  }
</style>