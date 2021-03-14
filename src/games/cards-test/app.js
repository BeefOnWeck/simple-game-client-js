import Vue from 'vue';
import App from './app.vue';
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');
socket.on('connect', function() {
  console.log(socket.id);

  Vue.config.productionTip = false;

  console.log(this);
  Vue.prototype.$socket = this;
  Vue.prototype.$appName = 'My App';

  console.log(Vue.version);

  new Vue({
    el: '#app',
    render: h => h(App),
    beforeCreate: function() {
      console.log(this.$appName)
    }
  });

});
