<template>
  <div id="app" v-if="isConnected">
    <Login @joined="joinedListener" v-if="!hasJoined"/>
    <div id="game-space" v-if="hasJoined">
      <Grid 
        v-bind:board="gameBoard" 
        v-bind:message="stateMessage" 
        v-bind:action="currentAction"
        v-bind:resources="playerResources"
        v-bind:roll="rollResult"
        v-bind:phase="phase"
        v-bind:myTurn="myTurn"
      />
    </div>
  </div>
</template>

<script>
import Login from '../tic-tac-toe/components/Login.vue'
import Grid from './components/Grid.vue'

import { provide } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000');

export default {
  name: 'Hexagon Island',
  components: {
    Login,
    Grid
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
      phase: 'boot',
      activePlayerName: '',
      currentAction: '',
      stateMessage: 'Waiting for game to start...',
      playerResources: {},
      rollResult: 0,
      gameBoard: {
        centroids: [],
        nodes: [],
        hexagons: [],
        numbers: [],
        roads: [],
        lines: [],
        villages: [],
        brigand: {}
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
      // Message should contain what actions the player needs to take
      let actionMessage = '';
      vc.currentAction = msg[0];
      if (vc.currentAction == 'setup-villages-and-roads') {
        actionMessage = 'Place one village and one road';
      } else if (vc.currentAction == 'roll-dice') {
        actionMessage = 'Roll the dice';
      } else if (vc.currentAction == 'build-stuff') {
        actionMessage = 'Go build stuff!';
      } else if (vc.currentAction == 'move-brigand') {
        actionMessage = 'Select a hexagon to move the brigand to.';
      }
      vc.stateMessage = 'It\'s your turn: ' + actionMessage;
    });
    socket.on('game-state', (msg) => {
      console.log(msg);
      vc.stateMessage = '';
      vc.gameBoard.villages = [];

      if (msg.activePlayer == vc.myId) {
        vc.myTurn = true;
      } else {
        vc.myTurn = false;
      }

      // Update the round and turn fields
      vc.round = msg.round;
      vc.phase = msg.phase;
      vc.activePlayerName = msg.players
        .filter(ply => ply.id == msg.activePlayer)
        .map(ply => ply.name)[0];
      vc.currentAction = msg.currentActions[0];

      // Update the player resources and dice result
      vc.playerResources = msg.state.playerResources;
      vc.rollResult = msg.state.rollResult;

      // Update the board using the state message
      msg.state.centroids.forEach((cent,idx) => {
        vc.gameBoard.centroids.splice(idx,1,cent);
        if (idx == msg.state.brigandIndex) {
          vc.gameBoard.brigand = {...cent};
        }
      });
      msg.state.nodes.forEach((node,idx) => {
        vc.gameBoard.nodes.splice(idx,1,node);
        const nodesPlayer = msg.players.filter(p => p.id === node.playerId)[0];
        const color = nodesPlayer ? nodesPlayer.color : null;
        vc.gameBoard.villages.push({
          x: node.x,
          y: node.y,
          color: color,
          opacity: color ? 1.0 : 0.0
        });
      });
      msg.state.hexagons.forEach((hex,idx) => {
        // SVG polygon defining a hexagon
        let poly = hex.vertices.reduce((acc, cv, ci) => {
          return ci<5 ? acc + `${cv.x},${cv.y}, ` : acc + `${cv.x},${cv.y}`;
        }, '');
        vc.gameBoard.hexagons.splice(idx,1,{
          poly: poly,
          resource: hex.resource
        });
      });
      msg.state.numbers.forEach((num,idx) => {
        vc.gameBoard.numbers.splice(idx,1,num);
      });
      msg.state.roads.forEach((road,idx) => {
        // Define SVG lines for all potential roads
        let node1 = msg.state.nodes[road.inds[0]];
        let node2 = msg.state.nodes[road.inds[1]];
        let path = `M ${node1.x} ${node1.y} L ${node2.x} ${node2.y}`;
        vc.gameBoard.lines.splice(idx,1,path);
        // Define SVG for built roads
        const roadsPlayer = msg.players.filter(p => p.id === road.playerId)[0];
        const color = roadsPlayer ? roadsPlayer.color : 'black';
        vc.gameBoard.roads.splice(idx,1,{
          path: path,
          color: color,
          opacity: color!='black' ? 1.0 : 0.0
        });
      });
      
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
#game-space{
  background-color: #eee;
  margin: auto;
  width: 50%;
  border: 1px solid #2c3e50;
  padding: 10px;
}
</style>
