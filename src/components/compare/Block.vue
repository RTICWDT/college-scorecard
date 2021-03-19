<template>
  <div>
    <h4 class="overline my-3">{{ block_title }}</h4>
    <div
      v-for="school in schools"
      :key="school.id"
      class="ml-sm-5 ml-1 compareBlocks"
    >
      <div
        v-if="isFieldOfStudy"
        :class="{
          active:
            currentHighlight ===
            `fos-${school.unit_id}-${school.code}-${school['credential.level']}`,
        }"
        @click="
          $emit(
            'update-highlight',
            `fos-${school.unit_id}-${school.code}-${school['credential.level']}`
          )
        "
      >
        <div class="pb-5 pb-md-1 px-md-5 px-1">
          <p class="subtitle-2 pb-0 mb-0">
            <a
              :href="
                `${$baseUrl}/school?${school.unit_id}&fos_code=${school.code}&fos_credential=${school['credential.level']}`
              "
            >
              <strong>{{ school.title | formatFieldOfStudyTitle }}</strong> -
              {{ school["school.name"] }}
            </a>
          </p>

          <div class="compare-fos-metric-container">
            <slot
              name="fos-row"
              v-bind:school="school"
              :config="config"
              :currentHighlight="currentHighlight"
            >
            </slot>
          </div>
        </div>
      </div>

      <div v-else>
        <slot
          name="institution-row"
          v-bind:school="school"
          :config="config"
          :currentHighlight="currentHighlight"
        >
          <compare-row
            :school="school"
            :config="config"
            :currentHighlight="currentHighlight"
            @update-highlight="$emit('update-highlight', $event)"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";
.compareBlocks {
  border-left: 1px solid $dark-gray;
}

.active {
  background-color: #faefd2 !important;
}

.compare-fos-metric-container {
  margin: 0.8rem 0;
}
</style>

<script>
import CompareRow from "~/components/compare/Row.vue"
import { fields } from "~/js/constants"

export default {
  components: {
    "compare-row": CompareRow,
  },
  props: {
    block_title: {
      type: String,
    },
    schools: {
      type: Array,
    },
    currentHighlight: {
      type: String,
    },
    config: {
      type: Object,
    },
    isFieldOfStudy: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
