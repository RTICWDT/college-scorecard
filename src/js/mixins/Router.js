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
    },
    $route: function(to) {
      this.$nextTick(function () {
      // $nextTick = DOM updated
    
    // Change document title
      document.title = to.meta.title;
    
        setTimeout(() => {

          // Get component's "routeFocusTarget" ref. 
          // If not existent, use router view container
          let focusTarget = (this.$refs.routerView.$refs.componentFocusTarget !== undefined) 
          ? this.$refs.routerView.$refs.componentFocusTarget
          : this.$refs.routerView.$el;

          // Make focustarget programmatically focussable
          focusTarget.setAttribute('tabindex', '-1');

          // Focus element
          focusTarget.focus();

          // Remove tabindex from focustarget. 
          // Reason: https://axesslab.com/skip-links/#update-3-a-comment-from-gov-uk
          focusTarget.removeAttribute('tabindex');
        }, 0);
      });
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