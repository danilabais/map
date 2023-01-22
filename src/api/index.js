import axios from 'axios'

//Добавить автоподставление api key interceptors

    const MainInstance = axios.create({
    baseURL: 'https://220.transflow.ru/api/public/v1/',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  MainInstance.interceptors.request.use((config)=> {
    config.params={
      //env
      key: '012345678abc'
    }
    return config
  });

export {MainInstance}