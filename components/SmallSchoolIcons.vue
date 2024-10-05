<template>
  <div>
    <ul class="school-key_figures key-figures mx-0 my-3 pa-0 d-flex justify-space-around">
      <v-tooltip location="bottom" v-if="!sizeOnly && yearIcon !== 'none'">
        <template v-slot:activator="{ props }">
          <li
            :class="yearsClass(years)"
            v-bind="props"
            :style="{ 'background-image': `url(${yearIcon})` }"
          >
            <span>{{ formatYearsLabel(years) }}</span>
          </li>
        </template>
        <div class="hover-tip">{{ tip }}</div>
      </v-tooltip>

      <li
        v-if="!sizeOnly && ownershipIcon !== 'none'"
        :class="controlClass(ownership)"
        :style="{ 'background-image': `url(${ownershipIcon})` }"
      >
        <span>{{ control(ownership) }}</span>
      </li>

      <li
        v-if="!sizeOnly && localeIcon !== 'none'"
        :class="localeClass(schoolLocale)"
        :style="{ 'background-image': `url(${localeIcon})` }"
      >
        <span>{{ locale(schoolLocale) }}</span>
      </li>

      <v-tooltip location="bottom" v-if="sizeIcon !== 'none'">
        <template v-slot:activator="{ props }">
          <li
            :class="sizeCategoryClass(schoolSize)"
            v-bind="props"
            :style="{ 'background-image': `url(${sizeIcon})` }"
          >
            <span>{{ sizeCategory(schoolSize) }}</span>
          </li>
        </template>
        <div class="hover-tip">{{ sizeTip }}</div>
      </v-tooltip>
    </ul>
  </div>
</template>

<script setup>
import {
  yearsClass,
  formatYearsLabel,
  controlClass,
  control,
  localeClass,
  locale,
  sizeCategoryClass,
  sizeCategory
} from '~/utils/filters'

const props = defineProps({
  school: {
    type: Object,
    required: true
  },
  fields: {
    type: Object,
    required: true
  },
  size: {
    default: 'regular',
    type: String
  },
  sizeOnly: {
    default: false,
    type: Boolean
  },
  fos: Boolean
})

const years = computed(() => useGet(props.school, props.fields['PREDOMINANT_DEGREE']))
const ownership = computed(() => useGet(props.school, props.fields['OWNERSHIP'], '-1'))
const schoolLocale = computed(() => useGet(props.school, props.fields['LOCALE'], '-1'))
const sizeField = computed(() => props.fos ? props.fields['FOS_SIZE'] : props.fields['SIZE'])
const schoolSize = computed(() => useGet(props.school, sizeField.value))

const tip = computed(() => {
  switch (years.value) {
    case 1: return "Most awards earned are certificates, but degrees may be offered."
    case 2: return "Most awards earned are 2-year associate's degrees, but other degrees or certificates may be offered."
    case 3: return "Most awards earned are 4-year bachelor's degrees, but other degrees or certificates may be offered."
    default: return "Most awards earned at this school are at this level, but other degrees or certificates may be offered."
  }
})

const sizeTip = computed(() => {
  const cat = sizeCategory(schoolSize.value)
  switch (cat) {
    case "Small": return "Up to 2,000 undergraduates"
    case "Medium": return "Between 2,000 and 15,000 undergraduates"
    case "Large": return "Over 15,000 undergraduates"
    default: return "Unavailable"
  }
})

const yearIcon = computed(() => {
  const icon = yearsClass(years.value)
  return icon ? `~/assets/images/school-icons/${icon.substr(5)}.svg` : 'none'
})

const ownershipIcon = computed(() => {
  const icon = controlClass(ownership.value)
  return icon ? `~/assets/images/school-icons/${icon.substr(5)}.svg` : 'none'
})

const localeIcon = computed(() => {
  const icon = localeClass(schoolLocale.value)
  return icon && icon !== 'unknown' ? `~/assets/images/school-icons/${icon.substr(5)}.svg` : 'none'
})

const sizeIcon = computed(() => {
  const icon = sizeCategoryClass(schoolSize.value)
  return icon ? `~/assets/images/school-icons/${icon.substr(5)}.svg` : 'none'
})

console.log(ownershipIcon.value)
</script>

<style lang="scss" scoped>

.school-key_figures-year {
  font-size: 1.1rem;
}

.school-key_figures {
  $height: 20px;
  margin-top: variables.$base-padding;
  $list: rural, town, suburban, city, small, medium, large, public, private, profit, two, four, certificate;

  @each $icon in $list {
    .icon-#{$icon} {
      background: transparent no-repeat, linear-gradient(transparent, transparent);
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
    color: variables.$black;

    .school-key_figures-year {
      display: block;
      font-weight: variables.$weight-bold;
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