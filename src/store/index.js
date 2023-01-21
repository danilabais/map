import Vue from 'vue'
import Vuex from 'vuex'

import { v4 as uuidv4 } from 'uuid';

Vue.use(Vuex)
import { getRoutes } from "@/api/routesApi";

export default new Vuex.Store({
  state: {
    routes: []
  },
  getters: {
  },
  mutations: {
    SET_ROUTES:(state,payload)=>state.routes.push(...payload) 
  },
  actions: {
    async fetchRoutes({commit}) {
      let response
      try {
        response = (await getRoutes())
      } catch (error) {
        console.log(error)
      }
      // console.log(response)
      commit('SET_ROUTES', response)
    }
  },
  getters: {
    routes (state) {
      return state.routes.map(el=>{
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
    stops (state) {

      const stopCount = {};

      // в полученных данных у остановок айди остановки в одно направление и в другое - совпадает.
      // на мой взгяд это не удобно, поэтому я переформирую айдишник добавляя +1 или -,
      const makeSuffixId =({Forward})=>'-'+String(Number(Forward))

      state.routes.forEach(route => {
      const uniqStop = [] // Учел чтобы маршруты были уникальные
      route.Stops.forEach(stop => {
          if (!stopCount[stop.ID+makeSuffixId(stop)]) {
            stopCount[stop.ID+makeSuffixId(stop)] = {
              id: stop.ID,
              uniqId: uuidv4(),
              countStopes: 1,
              name: stop.Name || 'Без названия',
              coords: [stop.Lat, stop.Lon],
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


