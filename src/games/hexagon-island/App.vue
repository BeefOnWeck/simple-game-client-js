<template>
  <div id="app" v-if="isConnected">
    <Login @joined="joinedListener" v-if="!hasJoined"/>
    
  </div>
</template>

<script>
import Login from '../tic-tac-toe/components/Login.vue'

import { provide } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000');

export default {
  name: 'Hexagon Island',
  components: {
    Login
  },
  methods: {
    joinedListener(e) {
      if (e.status == 'You have been added') {
        this.myName = e.name;
        this.hasJoined = true;
      }
    }
  },
  data() {
    return {
      isConnected: false,
      myId: null,
      myName: null,
      hasJoined: false,
      myTurn: false,
      round: 1,
      activePlayerName: '',
      currentAction: '',
      stateMessage: 'Waiting for game to start...',
    }
  },
  setup() {
    // Injecting child components with the socket
    // NOTE: Child components can use and modify the socket, but their changes
    // won't be reflected here.
    provide('socket', socket);
  },
  created() {
    let vc = this;
    socket.on('connect', function() {
      vc.myId = this.id;
      vc.isConnected = true; // We don't render until the socket is connected
    });
    socket.on('start-your-turn', (msg) => {
      vc.myTurn = true;
      // Message should contain what actions the player needs to take
      let actionMessage = msg == 'make-initial-bet' ?
        'Make your initial bet.' :
        'Make your move (hit, stand, double)';
      vc.stateMessage = 'It\'s your turn: ' + actionMessage;
    });
    socket.on('game-state', (msg) => {
      console.log(msg);
      vc.stateMessage = '';

      // Update the round and turn fields
      vc.round = msg.round;
      vc.activePlayerName = msg.players
        .filter(ply => ply.id == msg.activePlayer)
        .map(ply => ply.name)[0];
      vc.currentAction = msg.currentActions[0];
      
    });

  },
  mounted() {

  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
body {
  /* background-color: #eee; */
  font-family: sans-serif;
}
</style>
