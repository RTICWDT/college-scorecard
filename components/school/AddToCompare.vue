<template>
  <div>
    <v-btn
      size="small"
      class="mr-2"
      :color="isSelected || isFull ? 'white' : '#0075B2'"
      @click="store.toggleSchool(school)"
      :readonly="isFull" 
    >
      <template #prepend>
        <v-icon
          size="small"
          :color="isSelected || isFull ? '#0075B2' : 'white'"
          icon="fa: fa fa-check-circle"
        />
      </template>

      <div v-if="isSelected">Added to Compare</div>
      <div v-else-if="isFull">Maximum of 10 Schools Reached</div>
      <div v-else>Add to Compare School</div>
    </v-btn>
  </div>
</template>

<script setup>
  const store = useCompareStore();

  const props = defineProps({
    school: { type: Object },
  });
  
  const isSelected = computed(() => store.institutions.find(({ id }) => id == props.school.id))
  const isFull = computed(() => store.institutions.length >= 10)
</script>
