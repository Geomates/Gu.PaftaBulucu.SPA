import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.vue';
import router from './router';

Vue.filter('formatUnixDate', (milliseconds: number) => {
  if (milliseconds) {
    const dateObject = new Date(milliseconds * 1000);
    const humanDateFormat = dateObject.toLocaleString('tr');
    return humanDateFormat;
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
