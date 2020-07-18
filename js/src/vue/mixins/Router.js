import querystring from "querystring";

export default {
  data(){
    return{
      queryStringParameters:[], // From URL
      setQueryStringParameters:[] // Desired Parameter Array
    };
  },
  watch:{
    setQueryStringParameters(val,oldVal){
    }
  },
  methods:{
    parseURLParameters(url = location.search.substr(1)){
      let query = querystring.parse(url);

      return query || {};
    },
    prepareQueryString(params){
      let qs = querystring.stringify(params);

      return encodeURIComponent(qs);
    }
  },
  created(){
    this.queryStringParameters = this.parseURLParameters(decodeURIComponent(window.location.search.substr(1)));
  }
}