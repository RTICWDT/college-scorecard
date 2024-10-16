<template>
  <div v-if="fieldsOfStudy.length > 0">
    <h4 class="text-overline">{{ title }}</h4>
    <div class="py-3">
      <div 
        v-for="fos in fieldsOfStudy" 
        class="pl-5 ml-2 result-card" 
        :class="{ 'bg-warning': store.highlightedFos === fos }" 
        @click="(event) => toggleHighlight(event, fos)"
      >
        <NuxtLink class="font-weight-bold text-body-2" :to="schoolLink(fos)">
          {{ fos.title }} - {{ fos.school.name }}
        </NuxtLink>
        <Spacer :height="10" />
        <slot name="data" :fos="fos"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useCompareStore();
const props = defineProps({
  fieldsOfStudy: Array,
  title: String,
});

const schoolLink = (fos) => {
  // debugger
  return "/"
}

const toggleHighlight = (event, fos) => {
  if (event.target.href) { return }
  store.highlightedFos === fos ? store.highlightedFos = null : store.highlightedFos = fos
}

</script>

<style scoped lang="scss">
.result-card {
  border-left: 1px solid #666;
}
</style>