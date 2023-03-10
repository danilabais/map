import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css'
import '@/assets/styles/main.scss'

import { LMap, LTileLayer, LMarker , LIcon, LPolyline, LTooltip,LControl} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-icon', LIcon);
Vue.component('l-poly-line', LPolyline);
Vue.component('l-tooltip', LTooltip);
Vue.component('l-control', LControl);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
