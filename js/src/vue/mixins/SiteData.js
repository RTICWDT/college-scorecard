export const SiteData = {
  computed:{
    PROGRAM_NAMES(){
      return this.site.data.programs.reduce( function(object,value){
        object[value.key] = value.label;
        return object;
      }, {});
    },
    RELIGIOUS_AFFILIATIONS_BY_NUMBER(){
      return this.site.data.religious_affiliations.reduce( function(object,value){
        object[value.value] = value.label;
        return object;
      }, {});
    },
    CIP2(){
      return this.site.data.cip_2_digit.reduce( function(object,value){
        object[value.label] = value.value;
        return object;
      }, {});
    },
    CIP4(){
      return this.site.data.cip_4_digit.map(function(value,key){
        return {cip4: value.label, field: value.value.replace('.','')}
      });
    }

  },
  data(){
    return {
      site:{
        data: siteDataAll
      }
    }
  }
}