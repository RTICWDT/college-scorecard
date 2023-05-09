<template>
  <!--  <v-combobox-->
  <!--    :items="menuFOS"-->
  <!--    item-text="selectTitle"-->
  <!--    @input="handleChange"-->
  <!--    :value="value"-->
  <!--  >-->
  <!--  </v-combobox>-->

  <!--  <v-combobox-->
  <!--    :items="displayDisable"-->
  <!--    @input="handleChange"-->
  <!--    :value="value"-->
  <!--  >-->
  <!--  </v-combobox>-->
  <div :id="containerId" class="field-of-study-select-search-container">
    <v-text-field
      id="field-of-study-select-search-text"
      aria-label="Field Of Study Select"
      :value="setInputValue(value)"
      @input="filterObject"
      @change="handleChange"
      @focus="handleSelectFocus"
      @click="handleSelectFocus"
      @click:append="handleSelectFocus"
      @click:clear="handleInputClear"
      placeholder="Enter a Field of Study"
      clearable
      outlined
      hide-details
      prepend-inner-icon="fas fa-search"
      class="mx-11"
    >
      <template slot="append">
        <v-icon class="fos-search-text-icon" v-if="displayMenu"
          >mdi-menu-up</v-icon
        >
        <v-icon class="fos-search-text-icon" v-else>mdi-menu-down</v-icon>
      </template>
    </v-text-field>

    <v-card
      class="field-of-study-select-search-result pr-2 mx-11"
      :id="resultId"
      v-show="displayMenu"
      max-width="92.5%"
    >
      <v-list v-show="displayFOS.length > 0">
        <v-list-group v-for="cip2 in displayFOS" :key="cip2.name">
          <template v-slot:activator>
            <v-list-item-content class="field-of-study-search-item-title">
              <v-list-item-title
                class="field-of-study-search-item-title"
                v-text="cip2.name"
              >
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            class="field-of-study-search-item-list-content"
            v-for="cip4 in cip2.fields"
            :key="cip4.text"
            two-line
            @click="handleFieldOfStudySelectClick(cip4)"
          >
            <v-list-item-content>
              <v-list-item-title
                v-text="cip4.text"
                class="field-of-study-search-item-body"
              ></v-list-item-title>
              <!--              <span>{{ cip4.text }}</span>-->
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>

      <span v-show="displayFOS.length <= 0">
        No Results
      </span>
    </v-card>
  </div>
</template>

<style lang="scss">
@import "~/sass/_variables";
.field-of-study-select-search-container {
  .v-text-field--outlined fieldset {
    color: $fos-color-gold !important;
    border: 2px solid;
  }
}

.field-of-study-select-search-result {
  position: absolute !important;
  /*width: 380px;*/
  max-height: 400px;
  overflow-y: scroll;
  z-index: 8;
  border: 2px $fos-color-gold solid !important;
  border-top: none !important;
  width:10%;

  .v-list-item__title {
    text-overflow: unset;
    overflow: unset;
    white-space: normal;
    overflow-wrap: break-word;
  }

  .v-list-item__subtitle {
    text-overflow: unset;
    overflow: unset;
    white-space: normal;
    overflow-wrap: break-word;
  }
}
.fos-search-text-icon {
  color: $fos-color-gold !important;
}

.field-of-study-search-item-title {
  font-weight: bold;
}

.field-of-study-search-item-body {
  padding-left: 20px;
  /*border: 1px solid black;*/
}

#field-of-study-select-search-text {
  padding-left:10px;
}

#field-of-study-select-search-container2 {
  .v-input__prepend-inner {
    z-index:2;
  }
  fieldset {
    background:white;
  }
}
</style>

<script>
export default {
  watch: {
    displayMenu(newVal, oldVal) {
      // Adjust Menu Width.  Fixes issue in IE
      if (newVal) {
        let menuWidth = document.getElementById(this.containerId).clientWidth

        if (menuWidth) {
          document.getElementById(this.resultId).style.width = menuWidth + "px"
        }
      }
    },
  },
  data() {
    return {
      displayFOS: [],
      menuFOS: null,
      selectedCip2: null,
      selectedCip4: null,
      displayMenu: false,
      fieldOfStudySearchInput: "",
      x: 0,
      y: 0,
    }
  },
  props: {
    cipTwoNestedCipFour: {
      type: Array,
      default: null,
      required: true,
    },
    value: {},
    containerId: {
      type: String,
      default: "field-of-study-select-search-container",
    },
    resultId: {
      type: String,
      default: "field-of-study-select-search-result",
    },
  },
  components: {},
  computed: {
    // textFieldBorderStyle(){
    //   if(this.displayMenu){
    //     return {
    //       borderBottom: 'none !important'
    //     }
    //   }
    // }
  },
  methods: {
    setInputValue(value) {
      if (this.value === {} || this.value === "" || this.value === null) {
        return ""
      } else {
        return this.value.text
      }
    },
    handleChange(event) {
      // console.log(event);
      if (
        event &&
        typeof event === "object" &&
        typeof event.level !== "undefined"
      ) {
        this.$emit("input", event)
        this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour)
      }
    },
    handleInputClear(e) {
      this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour)
      this.$emit("input-clear", e)
    },
    handleFieldOfStudySelectClick(cip4) {
      // console.log(cip4);
      // this.$nextTick(() => {
      //   this.
      // })
      this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour)
      this.displayMenu = false
      this.$emit("input", cip4)
    },
    handleSelectFocus(event) {
      // console.log(event);
      // console.log('focus');
      // this.$nextTick(() => {
      //   this.displayMenu = true
      // })
      // this.displayMenu = true
      event.preventDefault()
      this.$nextTick(() => {
        this.displayMenu = true
      })
    },
    handleSelectBlur(event) {
      // console.log("Blur");
      // console.log(event);
      // if(event.relatedTarget === null || event.relatedTarget.className !== "v-list-group__header v-list-item v-list-item--link theme--light"){
      //   this.displayMenu = false;
      // }
    },
    filterObject(value) {
      if (!value || value === "") {
        this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour)
        return null
      }
      //console.log("Search")
      //console.log(value)

      let displayData = this.cipTwoNestedCipFour.reduce((returnArray, cip2) => {
        let tmpFieldsArray = cip2.fields.reduce((cip4Array, cip4) => {
          if (
            cip4.text.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >
            -1
          ) {
            cip4Array.push(cip4)
          }
          return cip4Array
        }, [])

        if (tmpFieldsArray.length > 0) {
          let tmpCip2Array = cip2
          tmpCip2Array.fields = tmpFieldsArray
          returnArray.push(tmpCip2Array)
        }

        return returnArray
      }, [])

      this.displayFOS = displayData
    },
  },
  mounted() {
    this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour)
    // console.log(this.cipTwoNestedCipFour);

    // Add listener for escape key
    document.addEventListener("keydown", (e) => {
      // console.log(e.code);
      // console.log(e.key);
      if (e.code === "Escape" || e.key === "Esc") {
        this.displayMenu = false
        document.getElementById("field-of-study-select-search-text").blur()
      }
    })

    // Click to close
    document.addEventListener("click", (e) => {
      // console.log('click: ');
      // console.log(e);

      if (e.target === null && typeof e.target.classList === "undefined") {
        return null
      }
      var classList = e.target.classList

      // Stay open for UI elements else close
      if (
        classList.contains("field-of-study-search-item-title") ||
        classList.contains("field-of-study-search-item-body") ||
        classList.contains("mdi-chevron-down") ||
        classList.contains("mdi-chevron-up") ||
        classList.contains("v-text-field__slot") ||
        classList.contains("fos-search-text-icon") ||
        e.target.id === "field-of-study-select-search-text"
      ) {
        return null
      } else {
        this.displayMenu = false
         if (document.getElementById("field-of-study-select-search-text")) {
          document.getElementById("field-of-study-select-search-text").blur()
         }
        
      }
    })
  },
}
</script>
