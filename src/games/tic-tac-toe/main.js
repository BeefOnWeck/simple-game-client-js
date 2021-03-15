import { createApp, reactive } from 'vue'
import App from './App.vue'
import { io } from "socket.io-client"

const socket = io('http://localhost:3000');
// socket.on('connect', function() {
//   const app = createApp(App);
//   app.provide('socket', this);
//   const board = reactive(Array.from({length:9}, () => null));
//   app.provide('board', board);
//   app.mount('#app');
// });

const app = createApp(App);
app.provide('socket', socket);
const board = reactive(Array.from({length:9}, () => null));
app.provide('board', board);
app.mount('#app');
