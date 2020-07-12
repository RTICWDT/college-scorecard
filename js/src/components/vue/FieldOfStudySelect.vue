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

  <v-combobox
    :items="menuFOS"
    @input="handleChange"
    :value="value"
  >
  </v-combobox>

</template>

<script>
export default {
  data(){
    return{
      displayFOS: null,
      menuFOS:null,
      selectedCip2: null,
      selectedCip4: null
    }
  },
  props:{
    displayFosCipFour:{
      type: Array,
      default: null
    },
    value:{
    }
  },
  components:{
  },
  computed:{
  },
  methods:{
    handleChange(event){
      console.log(event);
      this.$emit('input', event);
    } 
  },
  mounted(){
    // Set up the select menu with cip2 headers and cip4 sub items;
    this.menuFOS = this.displayFosCipFour.reduce((final,item) => {
      final.push({header:item.name});
      final.push(...item.fields);
      return final;
    },[]);
  }
};
</script>