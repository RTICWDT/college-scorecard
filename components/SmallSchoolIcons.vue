<template>
  <div class="school-key-figures-container">
    <ul class="school-key-figures">
      <v-tooltip location="bottom" v-if="!sizeOnly && yearIcon !== 'none'">
        <template v-slot:activator="{ props }">
          <li :class="yearsClass(years)" v-bind="props">
            <img :src="yearIcon" alt="" class="schoolIcon" :height="imgSize" />
            <span>{{ formatYearsLabel(years) }}</span>
          </li>
        </template>
        <div class="hover-tip">{{ tip }}</div>
      </v-tooltip>

      <li v-if="!sizeOnly && ownershipIcon !== 'none'" :class="controlClass(ownership)">
        <img :src="ownershipIcon" alt="" class="schoolIcon" :height="imgSize" />
        <span>{{ control(ownership) }}</span>
      </li>

      <li v-if="!sizeOnly && localeIcon !== 'none'" :class="localeClass(schoolLocale)">
        <img :src="localeIcon" alt="" class="schoolIcon" :height="imgSize" />
        <span>{{ locale(schoolLocale) }}</span>
      </li>

      <v-tooltip location="bottom" v-if="sizeIcon !== 'none'">
        <template v-slot:activator="{ props }">
          <li :class="sizeCategoryClass(schoolSize)" v-bind="props">
            <img :src="sizeIcon" alt="" class="schoolIcon" :height="imgSize" />
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
  imgSize: {
    default: 30,
    type: Number
  },
  fontSize: {
    default: 0.7,
    type: Number
  },
  fontWeight: {
    default: 600,
    type: Number
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
  return icon ? `/school-icons/${icon.substring(5)}.svg` : 'none'
})

const ownershipIcon = computed(() => {
  const icon = controlClass(ownership.value)
  return icon ? `/school-icons/${icon.substring(5)}.svg` : 'none'
})

const localeIcon = computed(() => {
  const icon = localeClass(schoolLocale.value)
  return icon && icon !== 'unknown' ? `/school-icons/${icon.substring(5)}.svg` : 'none'
})

const sizeIcon = computed(() => {
  const icon = sizeCategoryClass(schoolSize.value)
  return icon ? `/school-icons/${icon.substring(5)}.svg` : 'none'
})

</script>

<style lang="scss" scoped>

.schoolIcon {
  font-size: v-bind(fontSize) + 'rem';
}

.school-key-figures {
  $height: 20px;
  $list: rural, town, suburban, city, small, medium, large, public, private, profit, two, four, certificate;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
  gap: 10px;
  padding: 0;
  list-style-type: none;

  @each $icon in $list {
    .icon-#{$icon} {
      background: transparent no-repeat, linear-gradient(transparent, transparent);
      background-position: top center;
      background-size: 50px $height;
    }
  }

  li {
    list-style-type: none;
    font-weight: v-bind(fontWeight);
    line-height: 1.1;
    min-height: $height;
    vertical-align: top;
    width: 55px;
    font-size: v-bind(fontSize) + 'rem';
    color: variables.$black;
    text-align: center;

    img {
      margin: 0 auto;
    }

    .schoolIcon {
      display: block;
      font-weight: variables.$weight-bold;
      padding-bottom: 6px;
    }

    &.certificate {
      margin-right: 20px;

      .schoolIcon {
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