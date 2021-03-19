<template>
  <span>
    <v-tooltip top color="#000000" max-width="600">
      <template v-slot:activator="{ on }">
        <v-icon x-small allow-overflow :color="color" dark v-on="on">fas fa-info-circle</v-icon>
      </template>
      <span><slot /></span>
    </v-tooltip>
  </span>
</template>

<style lang="scss" scoped>
.csTooltip {
  font-size: 1rem;
}
</style>

<script>

export default {
  props: {
    text: String,
    color: {
      type: String,
      default: "blue darken-3"
    }
  }
};
</script>