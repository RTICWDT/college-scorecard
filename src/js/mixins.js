export const compare = {
  data: function () {
    return {
      showCompare: false,
      showInfoText: false
    };
  },
  computed:{
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
      this.showInfoText = false;
    },
    isSelected(data,collection) {
      return _.findIndex(collection, data) >= 0;
    }
  }
}
  