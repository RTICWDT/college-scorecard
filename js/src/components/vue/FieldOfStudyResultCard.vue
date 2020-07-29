<template>
  <v-card
    class="search-result-card mx-auto pa-0 elevation-4"
    outlined
    :class="{'result-card-selected': isSelected}"
  >

  </v-card>
</template>

<script>
  import Tooltip from './Tooltip.vue';
  import SmallSchoolIcons from './SmallSchoolIcons.vue';
  import ComplexFields from '../../vue/mixins/ComplexFields.js';

  export default {
    props:{
      school:{
        // The School object
        type: Object,
        required: true
      },
      isSelected:{
        type: Boolean,
        default: false
      }
    },
    components:{

    }

  }
</script>