import Vue from 'vue';
import App from './App.vue';
import filters from './filters';

Object.entries(filters).forEach(([key, filter]) => {
  Vue.filter(key, filter);
});
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
