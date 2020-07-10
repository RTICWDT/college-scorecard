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

  <v-combobox
    :items="menuFOS"
    item-text="selectTitle"
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
    allCipTwo:{
      type: Object,
      required: true
    },
    value:{
    }
  },
  components:{
  },
  computed:{
  },
  methods:{
    // TODO - Add tests to this method.  Maybe move it somewhere centralized;
    organizeFieldsOfStudy(availableFieldsOfStudy4, filter = null){
      let processedPrograms = {};
      let self = this;

      availableFieldsOfStudy4.forEach((program, idx) => {
        if(program.credential.level==3) {
          program.credential.title = "Bachelor's Degree";
        }
        
        let twodigit = program.code.substr(0, 2);
        if (_.includes([1,2,3], program.credential.level) && !processedPrograms[this.allCipTwo[twodigit]]){
          processedPrograms[this.allCipTwo[twodigit]] = [];
        }

        if(_.includes([1,2,3], program.credential.level)) {
          processedPrograms[this.allCipTwo[twodigit]].push({
            selectTitle: `${program.title} - ${program.credential.title}`, // TODO - String Filter?
            ...program
            // value: `${program.code}-${program.credential.level}`
            // code: program.code,
            // credential: program.credential
          });
        }
      });

      let sorted = [];
      for(var cip2 in processedPrograms){
        sorted.push({
        name: cip2,
          fields: _.sortBy(processedPrograms[cip2], ['title'])
        });
      };

      return _.sortBy(sorted, ['name']);
    },
    handleChange(event){
      console.log(event);
      this.$emit('input', event);
    } 
  },
  mounted(){
    this.displayFOS = this.organizeFieldsOfStudy(this.displayFosCipFour,null);
    
    // Set up the select menu with cip2 headers and cip4 sub items;
    this.menuFOS = this.displayFOS.reduce((final,item) => {
      final.push({header:item.name});
      final.push(...item.fields);
      return final;
    },[]);
    // this.displayFOS = this.displayFOS.map((item) => {
    //   return {fields: item.fields, value: 1, header:item.name}
    // })
  }
};
</script>