
const Helper = codeceptjs.helper;
const puppeteer = require('puppeteer');

class LocalStorage extends Helper {
  
  fillLocalStorage(key,fillArray = []) {
    const { page } = this.helpers.Puppeteer;
    
    page.evaluate((key,fillArray)=>{
      localStorage.setItem(key,JSON.stringify(fillArray));
    },key, fillArray);
  }
}

module.exports = LocalStorage;
