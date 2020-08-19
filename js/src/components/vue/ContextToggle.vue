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

  <v-tabs
    id="context-toggle"
    :value="controlTab"
    :show-arrows="true"
    slider-size="8"
    @change="$emit('context-tab-change', $event)"
    height="70px"
  >

    <v-tabs-slider id="context-toggle-slider" :class="{'compare-fos-slider-gold': controlTab === 1}" />

    <v-tab :id="tabID('institutions', controlTab)">
      <h3 class="compare-tab-title">
        Schools
      </h3>
    </v-tab>

    <v-tab :id="tabID('fos', controlTab)">
      <h3 class="compare-tab-title">
        Fields of Study
      </h3>
    </v-tab>

  </v-tabs>

<!--  <v-item-group-->
<!--    v-model="selected"-->
<!--  >-->
<!--    <v-item v-slot:default="{ active, toggle }">-->
<!--      <span>School</span>-->
<!--    </v-item>-->

<!--    <v-item>-->
<!--      <span>Field of Study</span>-->
<!--    </v-item>-->

<!--  </v-item-group>-->


</template>

<style lang="scss" scoped>
  @import 'sass/_variables';

  #context-toggle{
    background-color: pink !important;
    width: 260px;

    .v-tab{
      width: 130px;
    }

    #compare-tab-inactive {
      background-color: #eeeeee;
      border-bottom: 8px solid #dcdada;

      h3{
        margin-bottom: -8px;
      }
    }
  }

 .v-slide-group__prev{
    display: none;
  }

  .compare-tab-title{
    letter-spacing: normal !important;
    color: black !important;
    text-transform: none !important;
    font-weight: 500;
  }

  #compare-toggle-school-active{
    background-color: #dee8ef;
  }

  #compare-toggle-fos-active{
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
        selected: null
      }
    },
    methods: {
      tabID(context, controlTab){
        if(context === 'institutions'){
          return (controlTab === 0) ? 'compare-toggle-school-active' : 'compare-tab-inactive'
        }else if(context === 'fos'){
          return (controlTab === 1) ? 'compare-toggle-fos-active' : 'compare-tab-inactive'
        }
      }
    },
    mounted(){
      // Hacky way to remove the pagination slider arrows.
      // document.querySelector('#context-toggle .v-slide-group .v-slide-group__prev').remove();
      // document.querySelector('#context-toggle .v-slide-group .v-slide-group__next').remove();
    }
  }
</script>