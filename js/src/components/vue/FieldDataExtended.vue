<template>
  <div class='fos-field-data-container'>

    <h3 class="grey lighten-4 pa-3 mt-2">
      Salary After Completing
    </h3>

    <!-- Salary After Completing-->
    <v-row class="mx-1 mx-sm-1">
      <v-col cols="12" md="5">
        <v-select
          hide-details
          :items="fosSalarySelectItems"
          :value="fosSalarySelect"
          @input="$emit('update-salary-select', $event)"
        />
      </v-col>

      <!--Median Earnings-->
      <v-col cols="12" md="3">
        <h4 class="mb-2 field-data-header-title">
          Median <br class="d-none d-md-block">Earnings&nbsp
          <tooltip definition="fos-number-of-graduates" :limitedFoS="fieldsLink" />
        </h4>

        <div v-if="fosSalarySelect === 'aid'">
          <div v-if="_.get(fos, fields.FOS_EARNINGS_FED)">
            <span class="fos-field-data-text">{{_.get(fos, fields.FOS_EARNINGS_FED) | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>

        </div>

        <div v-else-if="fosSalarySelect === 'pell'">
          <div v-if="_.get(fos, fields.FOS_EARNINGS_PELL)">
            <span class="fos-field-data-text">{{_.get(fos, fields.FOS_EARNINGS_PELL) | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>
        </div>
      </v-col>

      <!--Monthly Earnings-->
      <v-col cols="12" md="4">
        <h4 class="mb-2">
          Monthly <br class="d-none d-md-block">Earnings&nbsp
          <tooltip definition="fos-number-of-graduates" :limitedFoS="fieldsLink" />
        </h4>

        <div v-if="fosSalarySelect === 'aid'">
          <div v-if="_.get(fos, fields.FOS_EARNINGS_FED)">
            <span class="fos-field-data-text">{{_.get(fos, fields.FOS_EARNINGS_FED) / 12 | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>

        </div>

        <div v-else-if="fosSalarySelect === 'pell'">
          <div v-if="_.get(fos, fields.FOS_EARNINGS_PELL)">
            <span class="fos-field-data-text">{{_.get(fos, fields.FOS_EARNINGS_PELL) / 12 | numeral('$0,0') }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>

        </div>
      </v-col>
    </v-row>

    <!-- Financial Aid &amp; Debt-->
    <h3 class="grey lighten-4 pa-3">
      Financial Aid &amp; Debt
    </h3>

    <v-row class="mx-1 mx-sm-1">
      <v-col cols="12" md="5">
        <v-checkbox
          hide-details
          v-model="checked"
          label="Include debt borrowed at any prior institutions"
        >
          <template v-slot:label>
            <span class="profile-fos-include-prior-debt">
              Include debt borrowed at any prior institutions&nbsp
              <tooltip definition="fos-number-of-graduates" :limitedFoS="fieldsLink" />
            </span>
          </template>
        </v-checkbox>
      </v-col>

      <!--Median Total-->
      <v-col cols="12" md="3">
        <h4 class="mb-2">
          Median Total <br class="d-none d-md-block">Debt After Graduation&nbsp
          <tooltip definition="fos-number-of-graduates" :limitedFoS="fieldsLink" />
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
          <tooltip definition="fos-number-of-graduates" :limitedFoS="fieldsLink" />
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

    <h3 class="grey lighten-4 pa-3">
      Additional Information
    </h3>

    <v-row class="mx-1 mx-sm-1">
      <!--Number Of Graduates-->
      <v-col cols="12" md="5">
        <h4 class="mb-2">
          Number Of Graduates&nbsp
          <tooltip definition="fos-number-of-graduates" :limitedFoS="fieldsLink" />
        </h4>
         <div v-if="_.get(fos, fields.FOS_GRAD_COUNT)">
           <span class="fos-field-data-text">{{_.get(fos, fields.FOS_GRAD_COUNT)}}</span>
        </div>

        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>

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

</style>

<script>
import Tooltip from 'components/vue/Tooltip.vue';

export default {
  components: {
    'tooltip': Tooltip
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
    }
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