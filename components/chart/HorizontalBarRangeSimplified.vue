<template>
<div v-if="hasData" class="w-100" :class="props.class || 'pb-5'">
  <div v-if="showMinMax" class="w-100 d-flex" style="font-size: 12px;">
    <div>{{  min.label }}</div>
    <div class="flex-grow-1" />
    <div class="text-right">{{ max.label }}</div>
  </div>

  <div class="w-100 d-flex bar">
    <div v-if="midpoint.show" class="midpoint" :style="{ left: `${midpointPosition}%` }">
      <div class="midpoint-text">
        {{ midpoint.label }}
      </div>
    </div>

    <div class="filled d-flex align-center" :style="{ width: `${percentFull}%` }">
      <div v-show="percentFull > thresholdPercent && showBarValues" class="w-100 text-right mr-2 text-white value-text">
        {{ value.label }}
      </div>
    </div>

    <div class="unfilled d-flex align-center" :style="{ width: `${percentEmpty}%` }">
      <div v-show="percentFull < thresholdPercent && showBarValues" class="ml-2 value-text">
        {{ value.label }}
      </div>
    </div>
  </div>
</div>
<div v-else class="data-na">
  <p>Data Not Available</p>
</div>
</template>

<script setup>
const props = defineProps({
  hasData: {
    type: Boolean,
    default: true,
  },
  min: {
    type: Object,
    default: { value: 0, label: "0" },
  },
  max: {
    type: Object,
    default: { value: 100, label: "100" },
  },
  value: {
    type: Object,
    default: { value: 50, label: "50" },
  },
  midpoint: {
    type: Object,
    default: {
      value: 0.5,
      label: "50",
      show: false,
    },
  },
  showMinMax: {
    type: Boolean,
    default: false,
  },
  showBarValues: {
    type: Boolean,
    default: true,
  },
  class: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: '#1570EF',
  },
})

const barColor = ref(props.color)

const { breakpoints } = useVuetify()

const percentFull = computed(() => {
  const minValue = props.min.value;
  const maxValue = props.max.value;
  const value = props.value.value;
  return ((value - minValue) / (maxValue - minValue)) * 100;
});

const percentEmpty = computed(() => {
  const minValue = props.min.value;
  const maxValue = props.max.value;
  const value = props.value.value;
  return ((maxValue - value) / (maxValue - minValue)) * 100;
});

const midpointPosition = computed(() => {
  const minValue = props.min.value;
  const maxValue = props.max.value;
  const midpoint = props.midpoint.value;
  return ((midpoint - minValue) / (maxValue - minValue)) * 100;
});

const thresholdPercent = computed(() => breakpoints.mdAndUp.value ? 80 : 50)
</script>

<style scoped lang="scss">
.bar {
  position: relative;
  height: 35px;
  background-color: use-theme('gray-100');

  .filled {
    height: 100%;
    position: absolute;
    background-color: v-bind('barColor');
    transition: all 0.5s;
  }

  .unfilled {
    background-color: use-theme('gray-100');
    position: absolute;
    top: 0px;
    right: 0px;
    height: 100%;
    transition: all 0.5s;
  }

  .value-text {
    font-size: 18px;
    font-weight: bold;
  }

  .midpoint {
    position: absolute;
    color: black;
    z-index: 10;
    height: 38px;
    background-color: black;
    width: 1px;
    transition: all 0.5s;

    &::after {
      content: "";
      width: 0;
      height: 0;
      border-bottom: 7px solid #000;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      position: relative;
      position: absolute;
      top: 37px;
      left: -6.5px;
    }
  }

  .midpoint-text {
    position: absolute;
    z-index: 10;
    color: rgb(87, 68, 68);
    font-size: 12px;
    font-style: italic;
    text-align: center;
    top: 45px;
    width: 120px;
    transform: translateX(-50%);
  }
}
</style>