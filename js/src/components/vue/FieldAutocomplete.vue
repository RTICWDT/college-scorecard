<template>
  <div>
    <v-autocomplete
      v-model="cip4"
      :items="items"
      :loading="isLoading"
      item-text="field"
      item-value="cip4"
      placeholder="Start typing to search"
      return-object
      autocomplete="off"
      v-on:change="$emit('input', cip4.cip4.replace('\.',''))"
      hide-details
      class='pt-0 mt-0'

    />
  </div>
</template>

<script>
import {find} from 'lodash';
import { EventBus } from '../../vue/EventBus.js';

export default {
  props: ["value"],
  data(){
    return{
        isLoading: false,
        cip4:{}
    }
  },
  computed: {
    items() {
      return _.sortBy(picc.CIP4,['field']);
    }
  },
  created(){
    // Transform value prop to expected component state.
    this.cip4 = this.mapValuePropToState(this.value);
  },
  mounted(){
    // Clear form event.
    EventBus.$on('search-form-reset', () => {
      this.cip4 = {};
    });
  },
  methods:{
    // Digest URL value and look up in program index.
    mapValuePropToState(value){
      if(value.length != 4){
        return null;
      }

      let groomedKey = value.slice(0,2) + '.' + value.slice(2);
      return find(this.items,{cip4: groomedKey});
    }
  }
};
</script>
