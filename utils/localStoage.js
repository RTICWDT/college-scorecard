import {localStorageKeys} from './constants.js';

export const LocalStorage = {
  selectAll: function (key) {
    return JSON.parse(window.localStorage.getItem(key)) || [];
  },
  // isSelected: function (id, key) {
  //   return (this.selectAll(key).map(function(fav){
  //     return +fav.schoolId;
  //   }).indexOf(id));
  // },
  isSelected: function(data, key){
    return _.findIndex(this.selectAll(key), data);
  },
  // toggleCompare: function (el,key){
  //   let dataset = el.dataset;
  //   let collection = dataset.school;
  //   let isSelected = this.isSelected(+dataset.schoolId, collection);
  //   let selectedSchools = this.selectAll(key);
  //
  //   if (isSelected >= 0) {
  //     selectedSchools.splice(isSelected, 1);
  //
  //     // save the new collection
  //     window.localStorage.setItem(collection, JSON.stringify(selectedSchools));
  //   } else {
  //
  //     if (selectedSchools.length < 10) {
  //       // add school to collection
  //       selectedSchools.push(dataset);
  //
  //       // save the new collection
  //       window.localStorage.setItem(collection, JSON.stringify(selectedSchools));
  //     }
  //   }
  // }

  toggleCompare: function(data,key){
    let isSelected = this.isSelected(data,key);
    let selectedItems = this.selectAll(key);

    //console.log("Selected Items");
    //console.log(selectedItems);

    if (isSelected >= 0) {
      selectedItems.splice(isSelected, 1);

      // save the new collection
      window.localStorage.setItem(key, JSON.stringify(selectedItems));
    } else {

      if (selectedItems.length < 10) {
        // add school to collection
        selectedItems.push(data);

        // save the new collection
        window.localStorage.setItem(key, JSON.stringify(selectedItems));
      }
    }
  }
}