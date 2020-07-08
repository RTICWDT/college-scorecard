<template>
  <!-- <ul>
    <li v-for='(prog, index) in displayFOS' :key='index'>
      <span>{{prog.name}}</span>
    </li>
  </ul> -->
  <div>


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
  </div>


</template>

<script>
export default {
  data(){
    return{
      displayFOS: null,
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
        if (!processedPrograms[this.allCipTwo[twodigit]]){
          processedPrograms[this.allCipTwo[twodigit]] = [];
        }
        processedPrograms[this.allCipTwo[twodigit]].push(program);
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
  },
  mounted(){
    this.displayFOS = this.organizeFieldsOfStudy(this.displayFosCipFour,null);
  }
};
</script>