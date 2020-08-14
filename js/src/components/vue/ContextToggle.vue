<template>
<!--  <div>-->
<!--    &lt;!&ndash;TODO - Style&ndash;&gt;-->
<!--    <v-btn-->
<!--      block-->
<!--      :depressed="displayToggle === 'institutions'"-->
<!--      :disabled="displayToggle === 'institutions'"-->
<!--      @click="$emit('context-switch-click','institutions')"-->
<!--    >-->
<!--      <slot name="school-button-text">Schools</slot>-->
<!--    </v-btn>-->
<!--    <v-btn-->
<!--      block-->
<!--      :depressed="displayToggle === 'fos'"-->
<!--      :disabled="displayToggle === 'fos'"-->
<!--      @click="$emit('context-switch-click','fos')"-->
<!--    >-->
<!--      <slot name="fos-button-text">Fields Of Study</slot>-->
<!--    </v-btn>-->
<!--  </div>-->

  <v-tabs :value="controlTab"
          fixed-tabs
          centered
          slider-size="8"
          @change="$emit('context-tab-change', $event)"
  >

    <v-tabs-slider :class="{'compare-fos-slider-gold': controlTab === 1}" />

    <v-tab :class="{'compare-toggle-school-active': controlTab === 0}">
      <h3 class="compare-tab-title">
        Schools
      </h3>
    </v-tab>

    <v-tab :class="{'compare-toggle-fos-active': controlTab === 1}">
      <h3 class="compare-tab-title">
        Fields of Study
      </h3>
    </v-tab>

  </v-tabs>

</template>

<style lang="scss" scoped>
  @import 'sass/_variables';

  .compare-toggle-school-active{
    background-color: #dee8ef;
  }

  .compare-toggle-fos-active{
    background-color: #fff6dc;
  }

  .compare-fos-slider-gold{
    background-color: $fos-accent-color;
  }

</style>

<script>
  export default{
    props:{
      displayToggle:{
        type: String
      },
      controlTab:{
        type: Number,
        default: 0
      }
    },
    data(){
      return{
      }
    }
  }
</script>