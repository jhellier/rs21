import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$mapboxAccessToken = "pk.eyJ1IjoiamhlbGxpZXIiLCJhIjoiY2pnMzB5MHE4MGhtdTM0bGp2bGE4MDZyOCJ9.aHuFeCPFydWal2gqw3baNA";

export const EventBus = new Vue();

new Vue({
  render: h => h(App)
}).$mount('#app')
