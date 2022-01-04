<template>
  <div id="app" v-if="isConnected">
    <Login @joined="joinedListener" v-if="!hasJoined"/>
    <div id="game-space" v-if="hasJoined">
      <Status
        v-bind:message="stateMessage" 
        v-bind:resources="playerResources"
        v-bind:roll="rollResult"
        v-bind:phase="phase"
      />
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
import Status from './components/Status.vue'

import { provide } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000');

export default {
  name: 'Hexagon Island',
  components: {
    Login,
    Status,
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
  updated() {
    // this.rollResult = this.roll;
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
  margin-top: 10px;
}
body {
  /* background-color: #eee; */
  font-family: sans-serif;
}
#game-space{
  /* background-color: #eee; */
  background-color: #cdcfea;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='%23586fca' fill-opacity='0.4' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E");
  margin: auto;
  width: 95%;
  max-width: 800px;
  border: 1px solid #2c3e50;
  padding: 10px;
}
</style>
