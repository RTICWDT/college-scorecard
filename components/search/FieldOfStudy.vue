<template>
  <v-combobox
    v-model="selectedItem"
    :items="items"
    item-title="title"
    item-value="code"
    return-object
    :filter-keys="['raw.cip4Title', 'raw.title']"
    filter-mode="union"

    prepend-inner-icon="mdi-magnify"
    color="primaryfos"
    variant="outlined"
    min-width="220"

    :density="dense ? 'compact' : 'default'"
    :label="dense ? '' : 'Type to search'"
    :placeholder="dense ? 'Type to search' : 'Search for a field of study'"
    aria-label="Field of Study Search"
    autocomplete="off"
    hide-no-data
    hide-details
    aria-required="true"
    aria-haspopup="listbox"
    required
    :list-props="{ tag: 'ul' }"
  >
    <template v-slot:item="{ item, props }">
      <v-list-item tag='li' role="option" v-bind="props">
        <v-list-item-subtitle class="subtitle" v-html="item.raw.cip4Title" />
      </v-list-item>
    </template>
  </v-combobox>
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