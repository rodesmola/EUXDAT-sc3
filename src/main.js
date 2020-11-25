import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import VueResource from 'vue-resource'

Vue.config.productionTip = true

Vue.use(VueResource)
Vue.use(Vuetify, {
  iconfont: 'mdi' // Material icons
})

Vue.use(VueKeyCloak, {
  config: {
    authRealm: "euxdat",
    authUrl: "https://test.euxdat.eu/auth",
    authClientId: "frontend",
    logoutRedirectUri: "https://frostdates.test.euxdat.eu/",
    //logoutRedirectUri: "http://localhost:8080",
  },

  onReady: () => {
    new Vue({
      el: '#app',
      template: '<App/>',
      render: h => h(App)
    })
  },
  init: {onLoad: 'login-required'}
})
