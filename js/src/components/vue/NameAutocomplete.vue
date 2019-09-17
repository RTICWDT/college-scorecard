<template>
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">textsms</i>
          <input type="text" id="autocomplete-input" class="autocomplete" v-model="ac">
            <v-autocomplete />
          <label for="autocomplete-input">Autocomplete</label>
        </div><button @click="getMatches()">go</button>

      </div>
</template>

<script>
export default {
    data() {
        return{
            ac: 'flor',
            ac_data: {},
            ac_list: {}
        }
    },
    methods: {
        getMatches(){
            var query = { fields: picc.fields.NAME, per_page: 20 };
            query[picc.fields.NAME] = this.ac;
            query = picc.form.prepareParams(query);
            console.log(query); 
            //uses debounced search call to avoid API spam
            picc.API.debounced_search(query, function(error, data){
                console.log('here');
                if (error || !data.results.length) { return {}; }
                console.log(data);
                var acdata = {};
                for(var i=0; i<data.results.length;i++){
                    acdata[data.results[i]['school.name']] = null;
                }
                console.log(acdata);
                var ac = M.Autocomplete.getInstance(document.querySelector('.autocomplete'));
                ac.updateData(acdata);
                ac.open()
            });
        },
        
    },
    mounted(){
        var elems = document.querySelectorAll('.autocomplete');
        this.instance = M.Autocomplete.init(elems);
        this.getMatches(this.ac);
    }
}
</script>