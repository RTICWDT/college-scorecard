const STORAGE_KEY = 'search-url';

export default {
  methods:{
    addURLToStorage(url) {
      if (process.isClient) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(url));
      }
    },
    returnURLFromStorage(){
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || null;
    }
  }
}