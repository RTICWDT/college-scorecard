import axios from 'axios';

const initializeConfig = (baseURL) => {
  // TODO - Add API key here.  An axios bug is preventing it right now.
  return axios.create({
    baseURL: baseURL
  });
}

const apiGet = function(baseURL,apiKey,uri,params = {}) {
  let apiInstance = initializeConfig(baseURL);

  return apiInstance.get(uri, {
    params:{
      api_key: apiKey,
      ...params
    }
  });
}

// TODO - Might want to add params and URI as an object then iterate. It would make this method is a little more versitile.
const apiGetAll = function(baseURL, apiKey, uri, paramArray){
  let promises = [];

  for(let i = 0; i < paramArray.length; i++){
    promises.push(
      apiGet(baseURL,apiKey, uri, paramArray[i])
    );
  }

  return axios.all(promises);
}

export { apiGet, apiGetAll };