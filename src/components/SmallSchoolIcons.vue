<template>
  <div>
    <ul
      class="school-key_figures key-figures mx-0 my-3 pa-0 d-flex justify-space-around"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <li
            :class="years | yearsClass"
            v-if="!sizeOnly && yearIcon != 'none'"
            v-on="on"
            :style="{ 'background-image': 'url(' + $url(yearIcon) + ')' }"
          >
            <span>{{ years | formatYearsLabel }}</span>
          </li>
        </template>
        <div class="hover-tip">{{ tip }}</div>
      </v-tooltip>
      <li
        :class="_.get(school, fields['OWNERSHIP'], '-1') | controlClass"
        v-if="!sizeOnly && ownershipIcon != 'none'"
        :style="{ 'background-image': 'url(' + $url(ownershipIcon) + ')' }"
      >
        <span>{{ _.get(school, fields["OWNERSHIP"], "-1") | control }}</span>
      </li>
      <li
        :class="_.get(school, fields['LOCALE'], '-1') | localeClass"
        v-if="!sizeOnly && localeIcon != 'none'"
        :style="{ 'background-image': 'url(' + $url(localeIcon) + ')' }"
      >
        <span>{{ _.get(school, fields["LOCALE"], "-1") | locale }}</span>
      </li>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <li v-if="sizeIcon != 'none'"
            :class="_.get(school, sizeField, '-1') | sizeCategoryClass"
            v-on="on"
            :style="{ 'background-image': 'url(' + $url(sizeIcon) + ')' }"
          >
            <span>{{
              _.get(school, sizeField, "-1") | sizeCategory
            }}</span>
          </li>
        </template>
        <div class="hover-tip">{{ sizeTip }}</div>
      </v-tooltip>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables.scss";
.school-key_figures-year {
  font-size: 1.1rem;
}
.school-key_figures {
  $height: 20px;
  margin-top: $base-padding;
  $list: rural, town, suburban, city, small, medium, large, public, private,
    profit, two, four, certificate;

  @each $icon in $list {
    .icon-#{$icon} {
      background: transparent no-repeat,
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
          content: "\f0a3";
          margin-left: 15px;
        }
      }
    }
  }
}
</style>

<script>
import _ from "lodash"

export default {
  props: {
    school: {
      type: Object,
    },
    fields: {
      type: Object,
      required: true,
    },
    size: {
      default: "regular",
      type: String,
    },
    sizeOnly: {
      default: false,
      type: Boolean,
    },
    fos: Boolean
  },
  created() {},
  computed: {
    years() {
      return _.get(this.school, this.fields["PREDOMINANT_DEGREE"])
    },
    sizeField() {
      return this.fos ? this.fields['FOS_SIZE'] : this.fields['SIZE']
    },
    tip() {
      switch (this.years) {
        case 1:
          return "Most awards earned are certificates, but degrees may be offered."
          break
        case 2:
          return "Most awards earned are 2-year associate's degrees, but other degrees or certificates may be offered."
          break
        case 3:
          return "Most awards earned are 4-year bachelor's degrees, but other degrees or certificates may be offered."
          break
        default:
          return "Most awards earned at this school are at this level, but other degrees or certificates may be offered."
          break
      }
    },
    sizeTip() {
      const cat = this.$options.filters.sizeCategory(
        _.get(this.school, this.fields["SIZE"], "-1")
      )
      switch (cat) {
        case "Small":
          return "Up to 2,000 undergraduates"
          break
        case "Medium":
          return "Between 2,000 and 15,000 undergraduates"
          break
        case "Large":
          return "Over 15,000 undergraduates"
          break
        default:
          return "Unavailable"
          break
      }
    },
    yearIcon() {
      let icon = this.$options.filters.yearsClass(this.years)
      if (icon) {
        return "/img/school-icons/" + icon.substr(5) + ".svg"
      } else {
        return "none"
      }
    },
    ownershipIcon() {
      let icon = this.$options.filters.controlClass(
        _.get(this.school, this.fields["OWNERSHIP"], "-1")
      )
      if (icon) {
        return "/img/school-icons/" + icon.substr(5) + ".svg"
      } else {
        return "none"
      }
    },
    localeIcon() {
      let icon = this.$options.filters.localeClass(
        _.get(this.school, this.fields["LOCALE"], "-1")
      )
      if (icon && icon != "unknown") {
        return "/img/school-icons/" + icon.substr(5) + ".svg"
      } else {
        return "none"
      }
    },
    sizeIcon() {
      let icon = this.$options.filters.sizeCategoryClass(
        _.get(this.school, this.sizeField)
      ) 
      if (icon) {
        return "/img/school-icons/" + icon.substr(5) + ".svg"
      } else {
        return "none"
      }
    },
  },
}
</script>
