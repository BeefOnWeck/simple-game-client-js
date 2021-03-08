<template>
  <div id="app">
    <p>Hello</p>
  </div>
</template>

<script>

import { io } from "socket.io-client";

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`);
socket.emit('join_game','my_name');

export default {
  name: 'CardsTest',
  components: {
  }
}

</script>

<style>

</style>
