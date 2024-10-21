<template>
  <CBox :items="items" v-model="selectedItem" />
</template>

<style scoped lang="scss">
.subtitle {
  color: variables.$mid-dark-gray;
}
</style>

<script setup>
const props = defineProps({
  dense: {
    type: Boolean,
    default: false
  },
})

const { site } = useSiteData()
const items = site.value.data.cip_6_digit
const selectedItem = ref()
</script>

<style lang="scss" scoped>
.v-combobox {
  :deep(.v-field__input) {}
}
</style>