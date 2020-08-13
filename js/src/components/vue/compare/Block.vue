<template>
  <div>
    <h4 class='overline my-3'>{{ block_title }}</h4>
    <div 
      v-for="school in schools" 
      :key="school.id" 
      class="ml-sm-5 ml-1 compareBlocks"
    >
      <div v-if="isFieldOfStudy">
        <div class='pb-1 px-sm-5 px-1'>
          <p class="subtitle-2 pb-0 mb-0">
            <a
              :href="`${$baseUrl}/school?${school.unit_id}&fos_code=${school.code}&fos_credential=${school['credential.level']}`">
              {{school.title | formatFieldOfStudyTitle}} - {{school['school.name']}}
            </a>
          </p>

          <slot
            name="fos-row"
            v-bind:school='school'
            :config='config'
            :currentHighlight='currentHighlight'
          >
          </slot>
        </div>
      </div>

      <div v-else>
        <slot
          name="institution-row"
          v-bind:school='school'
          :config='config'
          :currentHighlight='currentHighlight'
        >
          <compare-row
            :school="school"
            :config="config"
            :currentHighlight="currentHighlight"
            @update-highlight="$emit('update-highlight', $event);"
          />
        </slot>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'sass/_variables';
.compareBlocks{
    border-left: 1px solid $dark-gray;
}
</style>

<script>
import CompareRow from "components/vue/compare/Row.vue";
import {fields} from "../../../vue/constants";


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
    },
    isFieldOfStudy: {
      type: Boolean,
      default: false
    }
  },
  
};
</script>
