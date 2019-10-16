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

export { apiGet };
// A function to start config options for each type of call
