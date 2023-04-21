<template>
  <div @update-highlight="$emit('update-highlight', $event)" class="mb-8 mt-8">
    <h2 class="heading">
      {{ title }}&nbsp;<tooltip
        v-if="definition"
        :definition="definition"
        :isCompare="true"
        :isPell="config.showPellOnly"
      />
    </h2>
    <v-row v-if="this.$slots.default">
      <v-col cols="10" class="px-3 pt-3">
        <slot></slot>
      </v-col>
    </v-row>
    <div v-for="(school_list, school_type) in schools" :key="school_type">
      <compare-block
        :block_title="school_type"
        :schools="school_list"
        :currentHighlight="currentHighlight"
        :config="config"
        v-if="school_list.length > 0"
        @update-highlight="$emit('update-highlight', $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script>
import CompareBlock from "~/components/compare/Block.vue"
import Tooltip from "~/components/Tooltip.vue"
export default {
  components: {
    "compare-block": CompareBlock,
    tooltip: Tooltip,
  },
  props: {
    schools: {
      type: Object,
    },
    title: {
      type: String,
    },
    currentHighlight: {
      type: String,
    },
    config: {
      type: Object,
    },
    definition: {
      type: String,
    },
  },
  computed: {
    loanDef() {
      if (["avg-loan-payment", "avg-debt"].includes(definition)) {
        if (this.config.aidLoanSelect === "plus") {
          definition = "parents-plus" + defintion
        }
        if (!this.aidShowMedianDebtWithPrior) {
          definition = definition + "-all-schools"
        }
        return definition
      }
    },
  },
}
</script>
