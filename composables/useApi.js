import axios from 'axios';

export const useApi = () => {
  const config = useRuntimeConfig();

  const apiInstance = axios.create({
    baseURL: config.public.apiUrl
  });

  const apiGet = async (uri, params = {}) => {
    try {
      const response = await apiInstance.get(uri, {
        params: {
          api_key: config.public.apiKey,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('API Get Error:', error, uri, params);
      throw error;
    }
  };

  const apiGetAll = async (uri, paramArray) => {
    try {
      const promises = paramArray.map(params => apiGet(uri, params));
      return await Promise.all(promises);
    } catch (error) {
      console.error('API GetAll Error:', error);
      throw error;
    }
  };

  return {
    apiGet,
    apiGetAll
  };
};