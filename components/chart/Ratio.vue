<template>
  <div>
    <div class="circle-container">
      <div class="bg-circle"></div>
      <div class="circle light">{{ props.value }}</div>
      :
      <div class="circle dark">1</div>
    </div>
    <div class="mt-4 d-inline-block float-left">
      <div class="key-box medium-blue"></div>
      Full-Time Students
      <div class="key-box ml-3 mid-dark-blue"></div>
      Full-Time Staff
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Number,
    default: 0
  }
})

const tabID = (context, controlTab) => {
  if (context === "institutions") {
    return controlTab === 0
      ? "compare-toggle-school-active"
      : "compare-tab-inactive"
  } else if (context === "fos") {
    return controlTab === 1
      ? "compare-toggle-fos-active"
      : "compare-tab-inactive"
  }
}
</script>

<style lang="scss" scoped>
.circle-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-weight: 600;
  font-size: 28px;
}

.bg-circle {
  height: 200px;
  width: 200px;
  position: absolute;
  border-radius: 50%;
  z-index: 1;
  border: 2px solid #ededed;
}

.circle {
  border-radius: 50%;
  background-color: blue;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 5em;
  width: 5em;
  color: white;
  z-index: 2;
}

.light {
  background: use-theme('secondary-blue');
  border: 0.1875em solid use-theme('secondary-blue');
}

.dark {
  background: use-theme('primary-blue');
  border: 0.1875em solid use-theme('primary-blue');
}

.key-box {
  margin-right: 10px;
  height: 10px;
  width: 10px;
  display: inline-block;
}

.mid-dark-blue {
  background-color: use-theme('primary-blue');
}

.medium-blue {
  background-color: use-theme('secondary-blue');
}
</style>