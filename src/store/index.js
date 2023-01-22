import Vue from 'vue'
import Vuex from 'vuex'

import { v4 as uuidv4 } from 'uuid';

Vue.use(Vuex)
import { getRoutes } from "@/api/routesApi";

export default new Vuex.Store({
  state: {
    routes: {
      data: [],
      isLoading:false,
      error: null
    },
  },
  mutations: {
    SET_ROUTES:(state,payload)=>state.routes.data.push(...payload),
    ROUTES_LOADING:(state,payload)=>state.routes.isLoading = payload,
    ADD_STOP:(state,payload)=>state.routes.data.find(route=>route.ID === payload.RouteID).Stops.push(payload)
  },
  actions: {
    async fetchRoutes({commit}) {
      commit('ROUTES_LOADING',true) // я не уверен, делают ли так во VUEX, но в pinia мы так делали
      try {
        const {data,error} = await getRoutes()
        setTimeout(()=>{
          commit('SET_ROUTES', data)
          commit('ROUTES_LOADING',false)
        },0)
      } catch (e) {
        commit('ROUTES_LOADING',false)
      } 
    },
    addStopToState({commit},payload) {
     const formated = {
        RouteID: Number(payload.routeId),
        Forward: payload.forward,
        Name: payload.name, 
        Lat: payload.position.lat, 
        Lon: payload.position.lng,
        ID: uuidv4(),
      }
      commit('ADD_STOP',formated)
    }
  },
  
  getters: {
    routes (state) {
      return state.routes.data.map(el=>{
        return {
          name: el.Name,
          countRoutes: el.Stops.length,
          id: el.ID,
          descr: el.Description,
          stops: el.Stops,
          points: el.Points?.map(el=>{
            return [el.Lat,el.Lon]
          }),
        }
      })
    },
    isLoadingRoutes (state) {
      return state.routes.isLoading
    },
    stops (state) {
      const stopCount = {};

      // в полученных данных у остановок айди остановки в одно направление и в другое - совпадает.
      // на мой взгяд это не удобно, поэтому я переформирую айдишник добавляя +1 или -,
      const makeSuffixId =({Forward})=>'-'+String(Number(Forward))

      state.routes.data.forEach(route => {
      const uniqStop = [] // Учел чтобы маршруты были уникальные
      route.Stops.forEach(stop => {
          if (!stopCount[stop.ID+makeSuffixId(stop)]) {
            stopCount[stop.ID+makeSuffixId(stop)] = {
              id: stop.ID,
              uniqId: uuidv4(),
              countStopes: 1,
              name: stop.Name || 'Без названия',
              coords: [stop.Forward?stop.Lat+.0001:stop.Lat-.0001, stop.Lon], // тк на остановки находились друг на друге - они перекрывали на карте и нижнее становились некликабельные - решение: сместить на чуть-чуть 
              forward: stop.Forward
            }
          } else if(!uniqStop.includes(stop.ID+makeSuffixId(stop))) {
            stopCount[stop.ID+makeSuffixId(stop)].countStopes++
          }
          uniqStop.push(stop.ID+makeSuffixId(stop))
        })
        uniqStop.length = 0
      });
      return Object.values(stopCount)
    }
  }
})


