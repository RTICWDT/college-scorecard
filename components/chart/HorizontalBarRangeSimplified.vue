<template>
<div class="w-100 pb-5">
  <div class="w-100 d-flex bar">
    <div v-if="midpoint" class="midpoint" :style="{ left: `${midpointPosition}%` }">
      <div class="midpoint-text">
        Midpoint: {{ midpoint.label }}
      </div>
    </div>

    <div class="filled d-flex align-center" :style="{ width: filledWidth }">
      <div v-show="value.value > threshold" class="w-100 text-right mr-2 text-white value-text">
        {{ value.label }}
      </div>
    </div>

    <div class="unfilled d-flex align-center" :style="{ width: unfilledWidth }">
      <div v-show="value.value < threshold" class="ml-2 value-text">
        {{ value.label }}
      </div>
    </div>
  </div>

</div>
</template>

<script setup>
const props = defineProps({
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
    default: null,
  }
})

const { breakpoints } = useVuetify()
const filledWidth = computed(() => `${props.value.value * 100}%`)
const unfilledWidth = computed(() => `${(1 - props.value.value) * 100}%`)
const midpointPosition = computed(() => props.midpoint.value * 100)
const threshold = computed(() => breakpoints.mdAndUp.value ? 0.8 : 0.5)


</script>

<style scoped lang="scss">
.bar {
  position: relative;
  height: 35px;
  background-color: use-theme('gray-100');

  .filled {
    height: 100%;
    position: absolute;
    background-color: use-theme('blue-600');
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