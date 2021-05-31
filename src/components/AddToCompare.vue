<template>
  <div>
    <v-btn
      :text="!isSelected"
      small
      class="d-none d-sm-inline"
      color="white"
      @click="
        $store.commit('toggleSchool', {
          schoolId: school.id,
          schoolName: school.school.name,
        })
      "
    >
      <v-icon x-small class="mr-2" :color="isSelected ? '#0075B2' : 'white'"
        >fa fa-check-circle</v-icon
      >
      <div v-if="isSelected">
        Added to Compare
      </div>
      <div v-else>Add to Compare School</div>
    </v-btn>

    <v-btn
      fab
      x-small
      color="white"
      class="d-inline d-sm-none mr-2"
      @click="
        $store.commit('toggleSchool', {
          schoolId: school.id,
          schoolName: school.school.name,
        })
      "
    >
      <v-icon small class="" :color="isSelected ? '#0075B2' : 'black'"
        >fa fa-check-circle</v-icon
      >
      <div class="sr-only" v-if="isSelected">
        Added to Compare
      </div>
      <div class="sr-only" v-else>Add to Compare School</div>
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
  },
}
</script>
