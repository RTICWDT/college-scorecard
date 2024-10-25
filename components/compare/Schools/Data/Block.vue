<template>
  <div v-if="institutions.length > 0">
    <div class="d-flex">
      <h4 class="text-uppercase text-caption text-gray-700">{{ title }}</h4>
      <div class="flex-grow-1" />
      <slot name="byline" :groupName="titleShorthand()" :institution="institutions[0]"></slot> 
    </div>
    <div class="py-3">
      <div v-if="hasSlot('override')">
        <slot name="override" :institutions="institutions"></slot>
      </div>
      <div
        v-else
        v-for="institution in institutions" 
        class="pl-5 ml-2 result-card" 
        :class="{ 'bg-yellow-600': store.highlightedInstitution === institution }" 
        @click="(event) => toggleHighlight(event, institution)"
      >
        <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(institution)">
          {{ institution.school.name }}
        </NuxtLink>
        <Spacer :height="10" />
        <slot name="data" :institution="institution"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useCompareStore();
const slots = useSlots();
const hasSlot = (name) => !!slots[name]
const { schoolLink } = useComplexFieldMethods()
const props = defineProps({
  institutions: Array,
  title: String,
});

const titleShorthand = () => {
  return props.title.split(' ')[0]
}

const toggleHighlight = (event, institution) => {
  if (event.target.href) { return }
  store.highlightedInstitution === institution ? store.highlightedInstitution = null : store.highlightedInstitution = institution
}
</script>

<style scoped lang="scss">
.result-card {
  border-left: 1px solid #666;
  min-height: 125px;
}
</style>