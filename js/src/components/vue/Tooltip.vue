<template>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon color="primary" dark v-on="on">fa info</v-icon>
      </template>
      <span>{{content}}</span>
    </v-tooltip>
</template>

<script>
export default {
    props: ['content'],
    data(){
        return {}
    }
}
</script>