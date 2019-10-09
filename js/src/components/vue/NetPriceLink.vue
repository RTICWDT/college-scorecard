<template>
  <v-btn
    rounded
    color="secondary"
    target="_blank"
    :href="'/school/transition/?url='+fixedUrl"
    v-if="url"
  >
    <v-icon small class="mx-1">fas fa-calculator</v-icon>
    <span class='d-none d-sm-flex'>Calculate your personal net price</span>
    <span class='d-block d-sm-none'>Calculte net price</span>
                      
  </v-btn>
</template>

<script>
export default {
    props:['url'],
    computed:{
        fixedUrl(){
            if(this.url == '#') return false;
            else if(this.url.match(/^http/)) return this.url;
            else return 'http://'+this.url;
        }
    }
}
</script>
