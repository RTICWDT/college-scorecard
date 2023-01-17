<template>
  <client-only>
    <v-combobox
      :value="selected"
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
      :disabled="disabled"
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
  },
  data() {
    return {
      selected: null,
    }
  },
  computed: {
    items() {
      return this.site.data.cip_6_digit
    },

    // TODO - use this to generate and cache cip info- It wasn't performant on runtime when switching search tabs.
    //   let cleanItems = this.site.data.cip_6_digit.reduce((formattedArray, cip6) => {
    //     // locate - Ensure we only have cip6 and cip4
    //     let locatedCip4FieldName = this.locateCip4Field(cip6.code.slice(0,4));
    //
    //     if(locatedCip4FieldName){
    //       formattedArray.push({
    //         ...cip6,
    //         cip4Title: locatedCip4FieldName
    //       });
    //     }
    //
    //     return formattedArray;
    //   },[]);
    //
    //   return _.sortBy(cleanItems, ['title']);
    // }
  },
  methods: {
    handleFieldOfStudySelect(selectedItem) {
      // Clear Input Field
      this.$nextTick(() => {
        this.selected = []
      })

      if (
        typeof selectedItem === "undefined" ||
        typeof selectedItem.code !== "string" ||
        selectedItem.code.length !== 6
      ) {
        return null
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
