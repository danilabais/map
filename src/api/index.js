import axios from 'axios'

//Добавить автоподставление api key interceptors

    const MainInstance = axios.create({
    baseURL: 'https://220.transflow.ru/api/public/v1/',
    timeout: 1000,
    headers: {}
  });

export {MainInstance}