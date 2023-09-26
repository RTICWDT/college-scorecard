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
    },
    // removeParameterFromURL(removeParamter){
    //   // Remove from QS params;
    //   // Pepare
    // }
  },
  created() {
    let url
    if (process.isClient) {
      url = window.location.search.substr(1)
    }
    else {
      url = ""
    }
    this.queryStringParameters = this.parseURLParameters(decodeURIComponent(url));
  }
}