import { createApp } from 'vue'
import App from './App.vue'
import { io } from "socket.io-client"

const socket = io('http://localhost:3000');
socket.on('connect', function() {
  const app = createApp(App);
  app.provide('socket', this);
  app.mount('#app');
});
