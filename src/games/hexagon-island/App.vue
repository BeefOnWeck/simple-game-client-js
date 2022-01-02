<template>
  <div id="app" v-if="isConnected">
    <Login @joined="joinedListener" v-if="!hasJoined"/>
    <div id="game-space" v-if="hasJoined">
      <Grid 
        v-bind:board="gameBoard" 
        v-bind:message="stateMessage" 
        v-bind:action="possibleActions"
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
      possibleActions: [],
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
    socket.on('it-is-your-turn', (msg) => {
      vc.myTurn = true;
      // Message should contain what actions the player needs to take
      let actionMessage = '';
      console.log('msg:',msg);
      vc.possibleActions = msg;
      if (vc.possibleActions.includes('setupVillagesAndRoads')) {
        actionMessage += '- Place one village and one road \n';
      }
      if (vc.possibleActions.includes('rollDice')) {
        actionMessage += '- Roll the dice \n';
      } 
      if (vc.possibleActions.includes('buildStuff')) {
        actionMessage += '- Go build stuff! \n';
      } 
      if (vc.possibleActions.includes('moveBrigand')) {
        actionMessage += '- Select a hexagon to move the brigand to. \n';
      }
      vc.stateMessage = 'It\'s your turn, take an action: \n' + actionMessage;
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

      // Update the round and phase fields
      vc.round = msg.round;
      vc.phase = msg.phase;

      // Update the actice player and possible actions
      vc.activePlayerName = msg.players
        .filter(ply => ply.id == msg.activePlayer)
        .map(ply => ply.name)[0];
      vc.possibleActions = msg.possibleActions[0];

      // Update the player resources and dice result
      vc.playerResources = msg.state.playerResources;
      vc.rollResult = msg.state.rollResult;

      // Update the grid centroids and brigand location
      // NOTE: Centroids typically do not change once the game starts
      msg.state.centroids.forEach((cent,idx) => {
        // TODO: Only do this once on the first state message
        vc.gameBoard.centroids.splice(idx,1,cent);
        if (idx == msg.state.brigandIndex) {
          vc.gameBoard.brigand = {...cent};
        }
      });

      // Update the grid nodes
      // NOTE: Nodes typically do not change once the game starts
      msg.state.nodes.forEach((node,idx) => {
        // TODO: Only do this once on the first state message
        vc.gameBoard.nodes.splice(idx,1,node);
        // Find the player who has a village on this node and get their color.
        const nodesPlayer = msg.players.filter(p => p.id === node.playerId)[0];
        const color = nodesPlayer ? nodesPlayer.color : null;
        vc.gameBoard.villages.push({
          x: node.x,
          y: node.y,
          color: color, // No player --> null color --> village not visible
          opacity: color ? 1.0 : 0.0
        });
      });

      // Update the grid hexagons
      // NOTE: Hexagons typically do not change once the game starts
      msg.state.hexagons.forEach((hex,idx) => {
        // SVG polygon defining a hexagon
        let poly = hex.vertices.reduce((acc, cv, ci) => {
          return ci<5 ? acc + `${cv.x},${cv.y}, ` : acc + `${cv.x},${cv.y}`;
        }, '');
        // TODO: Only do this once on first game status message
        vc.gameBoard.hexagons.splice(idx,1,{
          poly: poly,
          resource: hex.resource
        });
      });

      // TODO: Not currently used; consider removing.
      msg.state.numbers.forEach((num,idx) => {
        vc.gameBoard.numbers.splice(idx,1,num);
      });

      // Update the roads
      msg.state.roads.forEach((road,idx) => {
        // Define SVG lines for all potential roads
        let node1 = msg.state.nodes[road.inds[0]];
        let node2 = msg.state.nodes[road.inds[1]];
        let path = `M ${node1.x} ${node1.y} L ${node2.x} ${node2.y}`;
        vc.gameBoard.lines.splice(idx,1,path);
        // Define SVG for built roads
        const roadsPlayer = msg.players.filter(p => p.id === road.playerId)[0];
        // TODO: Consider replacing with `const color = roadsPlayer?.color`
        const color = roadsPlayer ? roadsPlayer.color : 'black';
        vc.gameBoard.roads.splice(idx,1,{
          path: path,
          color: color,
          opacity: color!='black' ? 1.0 : 0.0 // TODO: Consider `color ? 1.0 : 0.0`
        });
      });
      
    });

  },
  mounted() {
    // TODO: Consider removing
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
