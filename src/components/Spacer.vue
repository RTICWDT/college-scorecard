<template>
  <div :style="{ height: height + 'px' }"></div>
</template>

<script>
export default {
  name: 'Spacer',
  props: {
    height: {
      type: Number,
      default: 50,
    },
  },
};
</script>