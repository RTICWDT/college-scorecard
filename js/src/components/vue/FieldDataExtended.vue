<template>
  <div class='fos-field-data-container'>

    <h3 class="grey lighten-4 pa-3 mt-2 fos-field-data-title">
      Salary After Completing
    </h3>

    <!-- Salary After Completing-->
    <v-row class="mx-1 mx-sm-1">

      <!--Median Earnings-->
      <v-col cols="12" md="5">
        <h4 class="mb-2 field-data-header-title">
          Median Earnings&nbsp
          <tooltip definition="fos-median-earnings" />
        </h4>

        <div>
          <div v-if="_.get(fos, fields.FOS_EARNINGS_FED)">
            <span class="fos-field-data-text">{{_.get(fos, fields.FOS_EARNINGS_FED) | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>

        </div>
      </v-col>

      <!--Monthly Earnings-->
      <v-col cols="12" md="4">
        <h4 class="mb-2">
          Monthly Earnings&nbsp
          <tooltip definition="fos-monthly-earnings" />
        </h4>

        <div>
          <div v-if="_.get(fos, fields.FOS_EARNINGS_FED)">
            <span class="fos-field-data-text">{{_.get(fos, fields.FOS_EARNINGS_FED) / 12 | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>

        </div>
      </v-col>
    </v-row>

    <!-- Financial Aid &amp; Debt-->
    <h3 class="grey lighten-4 pa-3 fos-field-data-title">
      Financial Aid &amp; Debt
    </h3>

    <v-row class="mx-1 mx-sm-1">
      <v-col cols="12" md="5" class="d-flex">
        <v-checkbox
          hide-details
          v-model="checked"
          label="Include debt borrowed at any prior institutions"
          color="secondary"
        >
          <template v-slot:label>
            <span class="profile-fos-include-prior-debt">
              Include debt borrowed at any prior institutions&nbsp
            </span>
          </template>
        </v-checkbox>
        <tooltip definition="include-debt-prior-inst" />
      </v-col>

      <!--Median Total-->
      <v-col cols="12" md="3">
        <h4 class="mb-2">
          Median Total <br class="d-none d-md-block">Debt After Graduation&nbsp
            <tooltip v-if="!fosShowDebtPriorIncluded" definition="fos-median-debt" />
            <tooltip v-else definition="fos-median-debt-all-schools" />
        </h4>

        <div v-if="!fosShowDebtPriorIncluded">
          <div v-if="_.get(fos, fields.FOS_DEBT_MEDIAN)">
            <span class="fos-field-data-text">{{_.get(fos, fields.FOS_DEBT_MEDIAN) | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>
        </div>

        <div v-else>
          <div v-if="_.get(fos, fields.FOS_DEBT_MEDIAN_PRIOR)">
            <span class="fos-field-data-text">{{_.get(fos, fields.FOS_DEBT_MEDIAN_PRIOR) | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>
        </div>
      </v-col>

      <!--Monthly Loan-->
      <v-col cols="12" md="3">
        <h4 class="mb-2">
          Monthly Loan Payment&nbsp
            <tooltip v-if="!fosShowDebtPriorIncluded" definition="fos-monthly-debt-payment" />
            <tooltip v-else definition="fos-monthly-debt-payment-all-schools" />
        </h4>

        <div v-if="!fosShowDebtPriorIncluded">
          <div v-if="_.get(fos, fields.FOS_DEBT_MONTHLY)">
            <span class="fos-field-data-text">{{_.get(fos,fields.FOS_DEBT_MONTHLY) | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>
        </div>

        <div v-else>
          <div v-if="_.get(fos, fields.FOS_DEBT_MONTHLY_PRIOR)">
            <span class="fos-field-data-text">{{_.get(fos, fields.FOS_DEBT_MONTHLY_PRIOR) | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>
        </div>

      </v-col>
    </v-row>

    <h3 class="grey lighten-4 pa-3 fos-field-data-title">
      Additional Information
    </h3>

    <v-row class="mx-1 mx-sm-1">
      <!--Number Of Graduates-->
      <v-col cols="12" md="5">
        <h4 class="mb-2">
          Number Of Graduates&nbsp
          <tooltip definition="fos-number-of-graduates" />
        </h4>
         <div v-if="_.get(fos, fields.FOS_GRAD_COUNT)">
           <span class="fos-field-data-text">{{_.get(fos, fields.FOS_GRAD_COUNT)}}</span>
        </div>

        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>

      </v-col>
    </v-row>


    <v-row>                            
          <v-col cols="12" md="6">
          <4 class="mb-0">
            Repayment Rate&nbsp;<tooltip definition="repayment-rate" /></h4>
      </v-col>
      <v-col cols="12" md="6">
        <v-checkbox
          v-model="showGradOnly"
          label="Only show data for those who graduated"
          color="secondary"
          class="mt-0"
          id="showGradOnly"
        >
          <template v-slot:label>
            <span>
              Only show data for those who graduated
            </span>
          </template>
        </v-checkbox> 
        </v-col>    
    </v-row>
    <v-row> 
        <v-col class="pt-0 pb-2">                            
          <repayment-rate :school="fos" colors="solid" :gradOnly="showGradOnly" />
        </v-col>
    </v-row>             
  </div>

</template>

<style lang="scss">
  @import 'sass/_variables';

  .fos-field-data-container{
    /*padding: 4px 0px;*/

    @media (min-width: 960px) {
      /*padding: 10px;*/
    }

  }

  .fos-field-data-text{
    font-size: 1rem !important;
    /*font-weight: bold;*/
  }

  .fos-field-data-title{
    font-weight: 500;
  }
  #showGradOnly {
    .v-messages {
      display:none;
    }
  }
</style>

<script>
import Tooltip from 'components/vue/Tooltip.vue';
import RepaymentRate from"components/vue/RepaymentRate.vue";

export default {
  components: {
    'tooltip': Tooltip,
    'repayment-rate': RepaymentRate
  },
  props: {
    fos:{
      type: Object,
      required: true
    },
    fosSalarySelectItems:{
      type: Array,
      required: true
    },
    fosSalarySelect:{
      type: String,
      required: true
    },
    fields:{
      type: Object,
      required: true,
    },
    fosShowDebtPriorIncluded:{
      type: Boolean,
      default: false
    },
    showGradOnly: false
  },
  computed:{
    isBranch(){
      return (this.fos.school.main_campus==0)
    },
    checked:{
      get(){
        return this.fosShowDebtPriorIncluded;
      },
      set(value){
        this.$emit('update-debt-show-prior', value);
      }
    }
  }
};
</script>