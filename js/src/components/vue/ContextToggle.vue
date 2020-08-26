<template>
  <v-tabs
    id="context-toggle"
    :value="controlTab"
    :show-arrows="true"
    slider-size="8"
    @change="$emit('context-tab-change', $event)"
    :height="tabsHeight"
    :style="tabContainerStyle"
    :grow="fillSpace"
  >

    <v-tabs-slider id="context-toggle-slider" :class="{'compare-fos-slider-gold': controlTab === 1}" />

    <v-tab :id="tabID('institutions', controlTab)"
      :style="tabStyle"
    >
      <slot name="tab-school">
        <h3 class="compare-tab-title">
          Schools
        </h3>
      </slot>
    </v-tab>

    <v-tab :id="tabID('fos', controlTab)"
      :style="tabStyle"
    >
      <slot name="tab-fos">
        <h3 class="compare-tab-title">
          Fields of Study
        </h3>
      </slot>
    </v-tab>

  </v-tabs>
</template>

<style lang="scss" scoped>
  @import 'sass/_variables';

  #context-toggle{

    #compare-tab-inactive {
      /*background-color: #eeeeee;*/
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
      },
      tabsHeight:{
        type: String,
        default: "70px"
      },
      tabContainerStyle:{
        type: Object,
        default(){
          return{
            width: '260px'
          }
        }
      },
      tabStyle:{
        type: Object,
        default(){
          return{
            width: '130px'
          }
        }
      },
      fillSpace:{
        type: Boolean,
        default: false
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