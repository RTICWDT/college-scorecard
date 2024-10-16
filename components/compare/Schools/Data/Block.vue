<template>
  <div v-if="institutions.length > 0">
    <h4 class="text-overline">{{ title }}</h4>
    <div class="py-3">
      <div 
        v-for="institution in institutions" 
        class="pl-5 ml-2 result-card" 
        :class="{ 'bg-warning': store.highlightedInstitution === institution }" 
        @click="(event) => toggleHighlight(event, institution)"
      >
        <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(institution)">
          {{ institution.title }} - {{ institution.school.name }}
        </NuxtLink>
        <Spacer :height="10" />
        <slot name="data" :institution="institution"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useCompareStore();
const { schoolLink } = useComplexFieldMethods()
const props = defineProps({
  institutions: Array,
  title: String,
});

const toggleHighlight = (event, institution) => {
  if (event.target.href) { return }
  store.highlightedInstitution === institution ? store.highlightedInstitution = null : store.highlightedInstitution = institution
}

</script>

<style scoped lang="scss">
.result-card {
  border-left: 1px solid #666;
}
</style>