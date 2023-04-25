<template>
  <div>
    <v-autocomplete
      id="search-form-fos-auto-complete"
      v-model="cip4"
      :items="items"
      :loading="isLoading"
      item-text="field"
      item-value="cip4"
      placeholder="Start typing to search"
      return-object
      autocomplete="off"
      v-on:change="change"
      hide-details
      class="pt-0 mt-0"
      color="secondary"
      clearable
      v-on:click:clear="clear"
      aria-labelledby="fields-label"
      dense
      outlined
    />
  </div>
</template>

<script>
import { find, sortBy, isEmpty } from "lodash"
import { SiteData } from "~/js/mixins/SiteData.js"

export default {
  mixins: [SiteData],
  props: {
    value: {
      default: null,
    },
  },
  data() {
    return {
      isLoading: false,
      cip4: {},
    }
  },
  watch: {
    value() {
      this.cip4 = this.mapValuePropToState(this.value)
    },
  },
  computed: {
    items() {
      return sortBy(this.CIP4, ["field"])
    },
  },
  created() {
    // Transform value prop to expected component state.
    this.cip4 = this.mapValuePropToState(this.value)
  },
  methods: {
    // Digest URL value and look up in program index.
    mapValuePropToState(value) {
      if (!value || value.length != 4) {
        return null
      }

      let groomedKey = value.slice(0, 2) + "." + value.slice(2)
      let locatedCip4 = find(this.items, { cip4: groomedKey })

      return locatedCip4 ? locatedCip4 : null
    },
    change() {
      if (!isEmpty(this.cip4)) {
        this.$emit("input", this.cip4.cip4.replace("\.", ""))
      }
    },
    clear() {
      this.cip4 = {}
      this.$emit("input", "")
    },
  },
}
</script>
