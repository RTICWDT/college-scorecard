<template>
  <v-card
    class="mx-auto pa-0 elevation-4"
    outlined
    :class="{'result-card-selected': isSelected}"
  >
    <v-card-text class="pa-3">
      <p class="mt-1 mb-2" v-if="underInvestigation==1">
        <v-card color="error" class="px-2 py-1" flat>
          <strong class="white--text">Under ED Monitoring</strong>
          <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
        </v-card>
      </p>

      <p>{{school.id}}</p>

<!--      <v-btn-->
<!--        text-->
<!--        icon-->
<!--        class="float-right search-result-card-compare"-->
<!--        :color="isSelected?'amber':'grey'"-->
<!--        @click="$emit('toggle-compare-school',school)"-->
<!--      >-->
<!--        <v-icon>fa fa-plus-circle</v-icon>-->
<!--        <span class='sr-only'>Compare</span>-->
<!--      </v-btn>-->
    </v-card-text>
  </v-card>
</template>

<script>
  import Tooltip from './Tooltip.vue';
  import SmallSchoolIcons from './SmallSchoolIcons.vue';
  import ComplexFields from '../../vue/mixins/ComplexFields.js';

  export default {
    mixins:[ComplexFields],
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