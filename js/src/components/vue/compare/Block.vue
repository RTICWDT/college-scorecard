<template>
  <div>
    <h4 class='overline my-3'>{{ block_title }}</h4>
    <div v-for="school in schools" :key="school.id" class='compareBlocks py-2'>
      <compare-row
        :school="school"
        :config="config"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'sass/_variables';
.compareBlocks{
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 1px solid $dark-gray;
}
</style>

<script>
import CompareRow from "components/vue/compare/Row.vue";

export default {
  components: {
    "compare-row": CompareRow
  },
  props: {
    block_title: {
      type: String
    },
    schools: {
      type: Array
    },
    config: {
    type: Object
    }
  }
};
</script>
