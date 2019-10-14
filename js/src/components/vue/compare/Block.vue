<template>
  <div >
    <h4 class='overline my-3'>{{ block_title }}</h4>
    <div 
      v-for="school in schools" 
      :key="school.id" 
      class="compareBlocks"
    >
      <compare-row
        :school="school"
        :config="config"
        :currentHighlight="currentHighlight"
        @update-highlight="$emit('update-highlight', $event);"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'sass/_variables';
.compareBlocks{
    margin-left: 1rem;
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
    currentHighlight: {
      type: String
    },
    config: {
      type: Object
    }
  },
  
};
</script>
