// Install Axios.
import axios from 'axios';

const initializeConfig = (baseURL) => {
  // TODO - Add API key here.
  return axios.create({
    baseURL: baseURL
  });
}

const apiGet = function(baseURL,apiKey,uri,params = {}) {
  // Check for required config
  let apiInstance = initializeConfig(baseURL);

  return apiInstance.get(uri, {
    params:{
      api_key: apiKey,
      ...params
    }
  });
}

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
