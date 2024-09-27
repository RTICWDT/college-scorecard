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
    closeModal(){
      this.showCompare = false;
      this.showInfoText = false;
    },
    isSelected(data,collection) {
      return _.findIndex(collection, data) >= 0;
    }
  }
}
  