<template>
  <!-- <div>
    <v-text-field
      label="Field Of Study"
      outlined
      dense
      append-icon="mdi-map-marker"
    ></v-text-field>

    <v-card
      height="400px"
      style="overflow:scroll"
    >
      <v-list>
       <v-list-group
          v-for="(program, index) in displayFOS"
          :key="index"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="program.name"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in program.fields"
            :key="subItem.title"
            two-line
            @click=""
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
  </div> -->


  <!-- I can't get this to work correctly.  Moving with a custom thing for now -->
  <!-- <v-combobox
    :items="displayFOS"
  >
    <template slot='item' slot-scope='{ item,on }'>
      <v-list>
       <v-list-group
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                v-text="item.name"
              >
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in item.fields"
            :key="subItem.title"
            two-line
            @click=""
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>

          </v-list-item>

        </v-list-group>
      </v-list>
    </template>
  </v-combobox> -->

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

<!--  Works but there are some issues with focus, blur-->
  <div>
    <v-text-field
      id="field-of-study-select-search-text"
      :value="setInputValue(value)"
      @input="filterObject"
      @change="handleChange"
      clearable
      hide-details
      @focus="handleSelectFocus"
      @blur="handleSelectBlur"
      @click:clear="handleInputClear"
    >
      <template slot="append">
        <v-icon v-if="displayMenu">mdi-menu-up</v-icon>
        <v-icon v-else>mdi-menu-down</v-icon>
      </template>
    </v-text-field>

    <v-card
      class="pa-2 mt-1"
      id="field-of-study-select-search-result"
      v-if="displayMenu"
    >
      <v-list>
        <v-list-group
          v-for="cip2 in displayFOS"
          :key="cip2.name"
        >
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
            v-for="cip4 in cip2.fields"
            :key="cip4.text"
            two-line
            @click="handleFieldOfStudySelectClick(cip4)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="cip4.text" class="field-of-study-search-item-body"></v-list-item-title>
            </v-list-item-content>

          </v-list-item>

        </v-list-group>
      </v-list>
    </v-card>
  </div>

<!--    <div>-->
<!--      <v-text-field-->
<!--        v-model="fieldOfStudySearchInput"-->
<!--        clearable-->
<!--        hide-details-->
<!--        @focus="handleSelectFocus"-->
<!--        @blur="handleSelectBlur"-->
<!--      >-->
<!--        <template slot="append">-->
<!--          <v-icon v-if="displayMenu">mdi-menu-up</v-icon>-->
<!--          <v-icon v-else>mdi-menu-down</v-icon>-->
<!--        </template>-->
<!--      </v-text-field>-->

<!--      <div id="field-of-study-select-search-result"-->

<!--      >-->
<!--      </div>-->

<!--      <v-menu-->
<!--        id="field-of-study-select-menu"-->
<!--        :value="displayMenu"-->
<!--        :close-on-click="false"-->
<!--        attach="#field-of-study-select-search-result"-->
<!--        absolute-->
<!--        z-index="99"-->
<!--      >-->
<!--        <v-list>-->
<!--          <v-list-group-->
<!--            v-for="cip2 in cipTwoNestedCipFour"-->
<!--            :key="cip2.name"-->
<!--          >-->
<!--            <template v-slot:activator>-->
<!--              <v-list-item-content>-->
<!--                <v-list-item-title-->
<!--                  v-text="cip2.name"-->
<!--                >-->
<!--                </v-list-item-title>-->
<!--              </v-list-item-content>-->
<!--            </template>-->

<!--            <v-list-item-->
<!--              v-for="ci4 in cip2.fields"-->
<!--              :key="ci4.text"-->
<!--              two-line-->
<!--              @click=""-->
<!--            >-->
<!--              <v-list-item-content>-->
<!--                <v-list-item-title v-text="ci4.text"></v-list-item-title>-->
<!--              </v-list-item-content>-->

<!--            </v-list-item>-->

<!--          </v-list-group>-->
<!--        </v-list>-->
<!--      </v-menu>-->

<!--    </div>-->



<!--    <v-menu-->
<!--      id="field-of-study-select-menu"-->
<!--      :value="displayMenu"-->
<!--      :close-on-click="false"-->
<!--      :close-on-content-click="false"-->
<!--      attach="#field-of-study-select-search-result"-->
<!--      absolute-->
<!--      z-index="99"-->
<!--    >-->
<!--      <v-list>-->
<!--        <v-list-group-->
<!--          v-for="cip2 in cipTwoNestedCipFour"-->
<!--          :key="cip2.name"-->
<!--        >-->
<!--          <template v-slot:activator>-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title-->
<!--                v-text="cip2.name"-->
<!--              >-->
<!--              </v-list-item-title>-->
<!--            </v-list-item-content>-->
<!--          </template>-->

<!--          <v-list-item-->
<!--            v-for="ci4 in cip2.fields"-->
<!--            :key="ci4.text"-->
<!--            two-line-->
<!--            @click=""-->
<!--          >-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title v-text="ci4.text"></v-list-item-title>-->
<!--            </v-list-item-content>-->

<!--          </v-list-item>-->

<!--        </v-list-group>-->
<!--      </v-list>-->
<!--    </v-menu>-->

<!--    <div id="field-of-study-select-items"-->
<!--      v-if="displayMenu"-->
<!--    >-->


<!--    </div>-->



</template>

<style lang="scss">
  #field-of-study-select-search-result{
    position: absolute;
    width: 380px;
    max-height: 400px;
    overflow-y: scroll;
    z-index: 8;

    .v-list-item__title{
      text-overflow: unset;
      overflow: unset;
      white-space: unset;
      overflow-wrap: break-word;
    }

    .v-list-item__subtitle{
      text-overflow: unset;
      overflow: unset;
      white-space: unset;
      overflow-wrap: break-word;
    }
  }

</style>

<script>
export default {
  data(){
    return{
      displayFOS: null,
      menuFOS:null,
      selectedCip2: null,
      selectedCip4: null,
      displayMenu: false,
      fieldOfStudySearchInput:"",
      x:0,
      y:0
    }
  },
  props:{
    // displayFosCipFour:{
    //   type: Array,
    //   default: null
    // },
    cipTwoNestedCipFour:{
      type: Array,
      default: null,
      required: true
    },
    value:{
    }
  },
  components:{
  },
  computed:{
    displayDisable(){
      // return this.displayFosCipFour.map((item) => {
      //   return {
      //     ...item,
      //     // disabled:true
      //   }
      // });
    }
  },
  methods:{
    setInputValue(value){
      if(this.value === {} || this.value === '' || this.value === null){
        return "";
      }else{
        return this.value.text;
      }
    },
    handleChange(event){
      // console.log(event);
      if(event && typeof event === 'object' && typeof event.level !== 'undefined'){
        this.$emit('input', event);
        this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour);
      }
    },
    handleInputClear(e){
      this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour);
      this.$emit('input-clear', e);
    },
    handleFieldOfStudySelectClick(cip4){
      // console.log(cip4);
      // this.$nextTick(() => {
      //   this.
      // })
      this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour);
      this.displayMenu = false;
      this.$emit('input',cip4);
    },
    handleSelectFocus(event){
      // console.log(event);
      // this.$nextTick(() => {
      //   this.displayMenu = true
      // })

      event.preventDefault();
      this.$nextTick(() => {
        this.displayMenu = true
      })
    },
    handleSelectBlur(event){
      // console.log("Blur");
      // console.log(event);
      // if(event.relatedTarget === null || event.relatedTarget.className !== "v-list-group__header v-list-item v-list-item--link theme--light"){
      //   this.displayMenu = false;
      // }
    },
    filterObject(value){
      // console.log("Search");
      // console.log(value);
      if(!value || value === "")
      {
        this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour);
        return null;
      }

      this.displayFOS = this.displayFOS.reduce((returnArray, cip2) => {
        let tmpFieldsArray = cip2.fields.reduce((cip4Array, cip4) => {
          if(cip4.text.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1){
            cip4Array.push(cip4);
          }
          return cip4Array;
        },[])

        if (tmpFieldsArray.length > 0){
          let tmpCip2Array = cip2;
          tmpCip2Array.fields = tmpFieldsArray;
          returnArray.push(tmpCip2Array);
        }

        return returnArray;
      },[])
    }
  },
  mounted(){
    // Set up the select menu with cip2 headers and cip4 sub items;
    // this.menuFOS = this.displayFosCipFour.reduce((final,item) => {
    //   final.push({header:item.name});
    //   final.push(...item.fields);
    //   return final;
    // },[]);

    this.displayFOS = _.cloneDeep(this.cipTwoNestedCipFour);


    // Add listener for escape key
    document.addEventListener("keydown", e => {
      if(e.code === 'Escape'){
        this.displayMenu = false;
        document.getElementById('field-of-study-select-search-text').blur();
      }
    });

    // Click to close
    document.addEventListener('click', e => {
      // console.log('click: ');
      // console.log(e);

      if(e.target === null && typeof e.target.classList === 'undefined'){
        return null;
      }
      var classList = e.target.classList

      // Stay open for UI elements else close
      if(
        classList.contains('field-of-study-search-item-title') ||
        classList.contains('field-of-study-search-item-body') ||
        e.target.id === 'field-of-study-select-search-text'
      ){
        return null;
      }else{
        this.displayMenu = false;
        document.getElementById('field-of-study-select-search-text').blur();
      }


    });
  }
};
</script>