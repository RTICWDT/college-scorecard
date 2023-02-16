<template>
  <client-only>
    <v-combobox
      :value="selectedFoS"
      @input="handleFieldOfStudySelect"
      @update:search-input="handleFieldOfStudySearchInput"
      :items="items"
      item-text="title"
      item-value="code"
      placeholder="Type to search"
      return-object
      autocomplete="off"
      clearable
      outlined
      hide-no-data
      hide-details
      color="fos-search-color"
      prepend-inner-icon="fas fa-search"
      aria-label="Field of Study Search"
      :dense="dense"
    >
      <template v-slot:label>
        <slot name="label-pass-through"></slot>
      </template>

      <template v-slot:item="data">
        <v-list-item-content>
          <div class="fos-search-result-item-container">
            <v-list-item-title v-html="data.item.title"></v-list-item-title>
            <v-list-item-subtitle
              v-html="data.item.cip4Title"
            ></v-list-item-subtitle>
          </div>
        </v-list-item-content>
      </template>
    </v-combobox>
  </client-only>
</template>

<style lang="scss">
@import "~/sass/_variables.scss";
.v-application .primary--text {
  color: green !important;
}
.v-application .fos-search-color--text {
  color: $fos-color-gold !important;
}
.fos-search-result-item-container {
  width: 300px;

  .v-list-item__title {
    text-overflow: unset;
    overflow: unset;
    white-space: unset;
    overflow-wrap: break-word;
  }

  .v-list-item__subtitle {
    text-overflow: unset;
    overflow: unset;
    white-space: unset;
    overflow-wrap: break-word;
  }
}
</style>

<script>
import { SiteData } from "~/js/mixins/SiteData.js"
import _ from "lodash"

export default {
  mixins: [SiteData],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: String,
      default: null,
    },
  },
  computed: {
    items() {
      return this.site.data.cip_6_digit
    },
    selectedFoS() {
      let field = null
      if (this.selected) {
        field = this.CIP4.find((itm) => {
          return this.selected == itm.cip4.replace(".", "")
        })["field"]
      }
      return field
    },
  },
  methods: {
    handleFieldOfStudySelect(selectedItem) {
      if (
        typeof selectedItem === "undefined" ||
        typeof selectedItem.code !== "string" ||
        selectedItem.code.length !== 6
      ) {
        let fieldOfStudy = {
          cip4: null,
          field: null,
        }

        this.$emit("field-of-study-selected", fieldOfStudy)
      }

      // Ensure there is a cip 4 in data
      let locateCip4 = this.CIP4.find((element) => {
        return element.cip4.replace(/\./g, "") === selectedItem.code.slice(0, 4)
      })

      if (
        typeof locateCip4 === "undefined" ||
        typeof locateCip4.field === "undefined"
      ) {
        return null
      }

      let fieldOfStudy = {
        cip4: selectedItem.code.slice(0, 4),
        field: locateCip4.field,
      }

      // Emit code.
      this.$emit("field-of-study-selected", fieldOfStudy) // Remove `.` from code string;
    },
    handleFieldOfStudySearchInput(searchString) {
      // console.log(searchString);
    },
  },
}
</script>
