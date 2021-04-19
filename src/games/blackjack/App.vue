<template>
  <div id="app" v-if="isConnected">
    <Login @joined="joinedListener" v-if="!hasJoined"/>
    <div v-if="hasJoined">
      <h1>Blackjack</h1>
      <h2>Dealer</h2>
      <Hand v-bind:hand="dealerHand"/>
      <h2>Other Players</h2>
      <div v-for="(value,key) in otherPlayers" v-bind:key="key">
        <h3>{{key}}</h3>
        <Hand v-bind:hand="value"/>
      </div>
      <h2>Your Hand</h2>
      <Hand v-bind:hand="myHand"/>
      <div>
        <Controls v-bind:actions="myActions"/>
      </div>
    </div>
  </div>
</template>

<script>
import Login from '../tic-tac-toe/components/Login.vue'
import Hand from './components/Hand.vue'
import Controls from './components/Controls.vue'

import { provide } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000');

export default {
  name: 'Blackjack',
  components: {
    Login,
    Hand,
    Controls
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
      myActions: [],
      myHand: [
        {rank: 'K', suit: '♠︎', side: 'flippable'},
        {rank: '8', suit: '♣︎'}
      ],
      dealerHand: [
        {rank: null, suit: null, side: 'faceDown'},
        {rank: '2', suit: '♥︎'}
      ],
      otherPlayers: {
        player1: [
          {rank: null, suit: null, side: 'faceDown'},
          {rank: '6', suit: '♦︎'}
        ]
      }
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
      console.log('I am the active player');
      // Message should contain what actions the player needs to take
      vc.myActions = msg;
      console.log(msg);
    });
    socket.on('game-state', (msg) => {
      console.log(msg);
      
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
  margin-top: 60px;
}
body {
  background-color: #eee;
  font-family: sans-serif;
}
</style>
