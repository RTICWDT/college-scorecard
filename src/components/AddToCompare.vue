<template>
  <div>
    <v-btn
      :text="!isSelected && !isFull"
      small
      color="white"
      @click="
        $store.commit('toggleSchool', {
          schoolId: school.id,
          schoolName: school.school.name,
        })
      "
    >
      <v-icon
        x-small
        class="mr-2"
        :color="isSelected || isFull ? '#0075B2' : 'white'"
        >fa fa-check-circle</v-icon
      >
      <div v-if="isSelected">
        Added to Compare
      </div>
      <div v-else-if="isFull">
        Maximum of 10 Schools Reached
      </div>
      <div v-else>Add to Compare School</div>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: { school: { type: Object } },
  computed: {
    isSelected() {
      return (
        this.$store.state.institutions.find(
          ({ schoolId }) => schoolId == this.school.id
        ) != undefined
      )
    },
    isFull() {
      return this.$store.state.institutions.length >= 10
    },
  },
}
</script>
