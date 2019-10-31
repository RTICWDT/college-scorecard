<template>
  <v-app id="four-oh-four">
    <scorecard-header />
    <v-content class="home-splash">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-card class='pa-5 text-center mt-10'>
            <h1 class='pb-3'>Page Not Found</h1>
            <p>We couldn't find the page you were looking for. Try searching again?</p>
            <name-autocomplete @school-name-selected="handleSchoolNameSelected"/>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <scorecard-footer />
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
  props:['baseUrl','pagePermalink'],
  methods:{
    handleSchoolNameSelected(school){
      window.location= '/search/?name='+ school;
    }
  }
}
</script>