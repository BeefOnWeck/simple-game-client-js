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
        <Controls v-bind:message="stateMessage"/>
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
      stateMessage: 'Waiting for game to start...',
      myHand: [],
      dealerHand: [],
      otherPlayers: {}
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

      // Update all player hands
      for (const [pid, phand] of Object.entries(msg.state.playerHands)) {

        // Start with an empty array for the face down cards
        let thisHand = Array.from({length: phand.faceDown});

        // If this is the current player we need to preserve the card rank and 
        // suit and mark the face down card as flippable.
        if (pid == vc.myId) {
          phand.faceDown.forEach(card => {
            thisHand.push({rank: card.rank, suit: card.suit, side: 'flippable'});
          });
        } else { // Otherwise strip the card rank and suit.
          thisHand = thisHand.fill({rank: null, suit: null, side: 'faceDown'});
        }

        // Add the face up cards to the player hand.
        phand.faceUp.forEach(card => {
          thisHand.push({rank: card.rank, suit: card.suit});
        });

        // Assign this hand to either the dealer, the current player, or the 
        // other player(s).
        if (pid == 'DEALER') { vc.dealerHand = thisHand; }
        else if (pid == vc.myId) { vc.myHand = thisHand; }
        else {
          // Look up the player name based upon their id
          const playerName = msg.players
            .filter(ply => ply.id == pid)
            .map(ply => ply.name)[0];
          vc.otherPlayers[playerName] = thisHand; 
        }

      }
      
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
