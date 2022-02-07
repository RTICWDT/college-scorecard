import axios from 'axios';

const initializeConfig = () => {
  // TODO - Add API key here.  An axios bug is preventing it right now.
  return axios.create({
    baseURL: process.env.GRIDSOME_API_URL
  });
}

const apiGet = function(uri,params = {}) {
  let apiInstance = initializeConfig();

  return apiInstance.get(uri, {
    params:{
      api_key: process.env.GRIDSOME_API_KEY,
      ...params
    }
  });
}

// TODO - Might want to add params and URI as an object then iterate. It would make this method is a little more versitile.
const apiGetAll = function(uri, paramArray){
  let promises = [];

  for(let i = 0; i < paramArray.length; i++){
    promises.push(
      apiGet(uri, paramArray[i])
    );
  }

  return axios.all(promises);
}

export { apiGet, apiGetAll };