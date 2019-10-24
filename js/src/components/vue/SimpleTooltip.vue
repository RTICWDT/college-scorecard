<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon x-small allow-overflow :color="color" dark v-on="on">fas fa-info-circle</v-icon>
      </template>
      <span>{{text}}</span>
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