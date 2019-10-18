<template>
  <v-app>
    <v-content class="home-splash">
      <v-container>
        <v-row>
          <v-col cols="6" offset="3">
            <v-card class='pa-5 text-center'>
            <h1>We flunked!</h1>
            <p>We couldn't find the page you were looking for. Try searching again?</p>
            <name-autocomplete />
            <div class="content-column">
              <img class='ma-4' src="/img/f-grade-paper.jpg" alt="Grade of F">
            </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<style lang="scss" scoped>
.home-splash {
  padding-top: 1.5rem;
}
</style>

<script>
import NameAutocomplete from 'components/vue/NameAutocomplete.vue';
export default {
  components: {
    'name-autocomplete': NameAutocomplete
  },
  props:['baseUrl','pagePermalink']
}
</script>