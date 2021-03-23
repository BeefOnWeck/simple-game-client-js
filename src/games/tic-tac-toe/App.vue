<template>
  <div id="app" v-if="isConnected">
    <h1>Tic-Tac-Toe</h1>
    <Login />
    <Grid v-bind:board="board" v-bind:myMark="myMark"/>
    <Controls/>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import Grid from './components/Grid.vue'
import Controls from './components/Controls.vue'
import { provide } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000');

export default {
  name: 'Tic-Tac-Toe',
  components: {
    Login,
    Grid,
    Controls
  },
  data() {
    return {
      isConnected: false,
      myTurn: false,
      board: Array.from({length:9}, () => '?'),
      myMark: null
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
      console.log('Socket ID:', this.id);
      vc.isConnected = true; // We don't render until the socket is connected
    });
    socket.on('start-your-turn', () => {
      vc.myTurn = true;
      console.log('I am the active player');
    });
    socket.on('game-state', (msg) => {
      console.log(msg);
      // Board is dynamically bound to the Grid child component
      vc.board = msg.state.grid.map(g => g.mark);
      // Grab the player's mark from the transmitted state
      vc.myMark = msg.players.filter(p => p.id === socket.id)[0].mark;
    });
  },
  mounted() {
    console.log(this);
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
  margin-top: 60px;
}
</style>
