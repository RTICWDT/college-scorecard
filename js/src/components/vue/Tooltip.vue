<template>
    <span>
    <v-tooltip top max-width="300" min-width="150" color="rgba(0,0,0,1)" content-class="csTooltip">
      <template v-slot:activator="{ on }">
        <v-icon small allow-overflow :color="color" dark v-on="on" @click="showDialog = !showDialog">fas fa-info-circle</v-icon>
      </template>
      <span v-html="content"></span>
    </v-tooltip>
    <v-dialog v-model="showDialog" class='csDialog' max-width="500" min-width="300">
      <v-card tile class='pa-5'>
        <p>Here is a dialog Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas possimus doloribus ullam nulla ducimus quaerat? Ea mollitia pariatur ab necessitatibus dolorum, consequuntur laborum nulla adipisci nobis facilis at sapiente quaerat!</p>
      </v-card>
    </v-dialog>
    </span>
</template>

<style lang="scss" scoped>
.csTooltip{
  font-size: 1rem;
  
}
</style>

<script>
export default {
    props: {
      definition: String, 
      custom: {
        type: String, 
        default: "default"
      },
      color:{
        type: String,
        default: "primary"
      }
    },
    data(){
      return {
        showDialog: false
      }
    },
    computed:{
      glossary(){
        return picc.GLOSSARY;
      },
      content(){
        return this.glossary[this.definition][this.custom];
      }
    }
}
</script>