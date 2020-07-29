<template>
  <div>
    <!--TODO - Style-->
    <v-btn
      block
      :depressed="displayToggle === 'institutions'"
      :disabled="displayToggle === 'institutions'"
      @click="$emit('context-switch-click','institutions')"
    >
      <slot name="school-button-text">Schools</slot>
    </v-btn>
    <v-btn
      block
      :depressed="displayToggle === 'fos'"
      :disabled="displayToggle === 'fos'"
      @click="$emit('context-switch-click','fos')"
    >
      <slot name="fos-button-text">Fields Of Study</slot>
    </v-btn>
  </div>
</template>

<script>
  export default{
    props:{
      displayToggle:{
        type: String
      }
    },
    data(){
      return{
      }
    }
  }
</script>