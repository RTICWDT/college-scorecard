<template>
  <CBox :items="options" v-model="selectedItem" />
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
const options = ref(site.value.data.cip_6_digit.map((item) => {
  return { id: item.code, text: item.title, subtitle: item.cip4Title }
}))
const selectedItem = ref()
</script>

<style lang="scss" scoped>
.v-combobox {
  :deep(.v-field__input) {}
}
</style>