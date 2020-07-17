export const compare = {
  data: function () {
    return {
      showCompare: false
    }
  },
  computed:{
    // isSelected() {
    // if (_.findIndex(this.compareSchools, ["schoolId", String(_.get(this.school, this.fields['ID']))]) >= 0) {
    //     return true;
    // }
    // return false;
    // },
  },
  methods:{
    handleToggleCompareSchool(school) {
      this.$emit("toggle-compare-school", school);
    },
    handleToggleCompareItem(item,key) {
      this.$emit("toggle-compare-school", item,key);
    },
    closeModal(){
      this.showCompare = false;
    },
    isSelected(data,collection) {
      return _.findIndex(collection,data);
    }
  }
}
  