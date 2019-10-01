<template>
  <div>
    <ul class="school-key_figures key-figures ma-0 pa-0 d-flex justify-space-around">
      <li v-if="!sizeOnly">
        <span v-if="years==1" class="school-key_figures-year">
          <v-icon small color="black">fa fa-certificate</v-icon>
        </span>
        <span v-else class="school-key_figures-year">{{ years | formatYearsText }}</span>
        <span class="label">{{ years | formatYearsLabel }}</span>
      </li>
      <li :class="_.get(school, fields['OWNERSHIP'], '-1') | controlClass" v-if="!sizeOnly">
        <span>{{ _.get(school, fields['OWNERSHIP'], '-1') | control }}</span>
      </li>
      <li :class="_.get(school, fields['LOCALE'], '-1') | localeClass" v-if="!sizeOnly">
        <span>{{ _.get(school, fields['LOCALE'], '-1') | locale }}</span>
      </li>

      <li :class="_.get(school, fields['SIZE'], '-1') | sizeCategoryClass">
        <span>{{ _.get(school, fields['SIZE'], '-1') | sizeCategory }}</span>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
@import "sass/_variables.scss";
.school-key_figures-year{
    font-size: 1.1rem;
}
.school-key_figures {
    $height: 20px;
    margin-top: $base-padding;

    $list:  rural, town, suburban, city,
            small, medium, large,
            public, private, profit;

    @each $icon in $list {
      .icon-#{$icon} {
        background: url(/img/school-icons/#{$icon}.png) no-repeat;
        background: url(/img/school-icons/#{$icon}.svg) no-repeat,
          linear-gradient(transparent, transparent);
        background-position: top center;
        background-size: 50px $height;
      }
    }

    li {
      list-style-type: none;
      font-weight: 600;
      line-height: 1.1;
      min-height: $height;
      padding-top: ($height + 10px);
      text-align: center;
      vertical-align: top;
      width: 55px;
      font-size: 0.7rem;
      margin-right: 5px;
      color: $black;


      .school-key_figures-year {
       
        display: block;
        font-weight: $weight-bold;
        margin-top: -25px;
        padding-bottom: 6px;

        &:empty {
          margin-top: -15px;
        }
      }

      &.certificate {
        margin-right: 20px;

        .school-key_figures-year {
          margin-top: -50px;

          &:before {
            font-family: "fontawesome";
            content: '\f0a3';
            margin-left: 15px;
          }
        }
      }
    }
  }


</style>
<script>
export default {
  props: {
    "school":{
      type: Object
    },
    "fields":{
      type: Object
    },
    "size":{
      default: 'regular',
      type:String
    },
    'sizeOnly':{
      default: false,
      type: Boolean
    }
  },
  computed: {
    years() {
      return _.get(this.school, this.fields["PREDOMINANT_DEGREE"]);
    }
  }
};
</script>