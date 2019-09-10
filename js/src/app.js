import Vue from 'vue';
import Test from './components/vue/Test.vue';

new Vue({
  el: '#app',
  data:{
    results:{}
  },
  components:{
    'test': Test
  },
  mounted(){
    document.addEventListener('search-updated', function () {
      console.log("Event Heard From Vue.");
    })
  }
});