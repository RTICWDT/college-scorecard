<template>
  <div>
    <ul class="school-key_figures key-figures my-5">
      <li>
        <span v-if="years==1" class="school-key_figures-year">
          <v-icon x-large color="black">fa fa-certificate</v-icon>
        </span>
        <span v-else class="school-key_figures-year">{{ years | formatYearsText }}</span>
        <span class="label">{{ years | formatYearsLabel }}</span>
      </li>
      <li :class="_.get(school, fields['OWNERSHIP'], '-1') | controlClass">
        <span>{{ _.get(school, fields['OWNERSHIP'], '-1') | control }}</span>
      </li>
      <li :class="_.get(school, fields['LOCALE'], '-1') | localeClass">
        <span>{{ _.get(school, fields['LOCALE'], '-1') | locale }}</span>
      </li>
      <li :class="_.get(school, fields['SIZE'], '-1') | sizeCategoryClass">
        <span>{{ _.get(school, fields['SIZE'], '-1') | sizeCategory }}</span>
      </li>
    </ul>
  </div>
</template>
<style lang="sass" scoped>
.school-key_figures-year{
    font-size: 2.86rem;
}
</style>
<script>
export default {
  props: ["school", "fields"],
  computed: {
    years() {
      return _.get(this.school, this.fields["PREDOMINANT_DEGREE"]);
    }
  }
};
</script>