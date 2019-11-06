
const Helper = codeceptjs.helper;
const puppeteer = require('puppeteer');

class LocalStorage extends Helper {
  
  async fillLocalStorage(key,fillArray = []) {
    const { page } = this.helpers.Puppeteer;
    
    let test = await page.evaluate((key,fillArray)=>{
      // return fillArray;
      fillArray.forEach(element => {
        localStorage.setItem(key,JSON.stringify(element));  
      });
    },key, fillArray)
    .catch(e => {
      console.log("Error: " + JSON.stringify(e));
    })

    console.log("key: " + JSON.stringify(test));
  }

  addToLocalStorage(key,value){

  }

}

module.exports = LocalStorage;
