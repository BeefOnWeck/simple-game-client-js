<template>
  <div class="controls-and-status" id="message-bar">
    <div v-bind:class="{'status-message':localMessage!=''}">
      {{localMessage}}
    </div>
    <div v-bind:class="{'error-message':errorMessage!=''}">
      {{errorMessage}}
    </div>
  </div>
  <div>
    Dice roll: {{roll}}
  </div>
  <div>
    Resources:
    <div v-for="(value, name) in resources" v-bind:key="name">
      {{ name }}: {{ value }}
    </div>
  </div>
  <form 
    id="build-control"
    v-on:submit.prevent="build(socket)"
  >
    <input type="submit" value="Build Selected">
  </form>
  <form 
    id="roll-control"
    v-on:submit.prevent="rollDice(socket)"
  >
    <input type="submit" value="Roll Dice">
  </form>
  <form 
    id="endTurn-control"
    v-on:submit.prevent="endturn(socket)"
  >
    <input type="submit" value="End Turn">
  </form>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Controls',
  components: {},
  props: [
    'message',
    'action',
    'selected',
    'playerResources',
    'rollResult',
    'gamePhase'
  ],
  emits: ['reset-selected'],
  setup() {
    const socket = inject('socket');
    return {socket};
  },
  data() {
    return {
      localAction: this.action,
      localMessage: this.message,
      errorMessage: '',
      selectedToBuild: this.selected,
      resources: this.playerResources,
      roll: this.rollResult,
      phase: this.gamePhase
    }

  },
  methods: {
    build(socket) {
      console.log('Trying to build.');
      console.log(this.selectedToBuild.nodes);
      console.log(this.selectedToBuild.roads);
      let buildAction = this.phase == 'setup' ? 'setupVillagesAndRoads'
        : this.phase == 'play' ? 'buildStuff'
        : '';
      console.log(buildAction);
      socket.emit('player-actions', {
        [buildAction]: {
          pid: socket.id,
          nodes: [...this.selectedToBuild.nodes],
          roads: [...this.selectedToBuild.roads]
        }
      }, response => {
        this.errorMessage = response.status;
        setTimeout(vc => vc.errorMessage = '', 3000, this);
      });
      this.$emit('reset-selected', true);
    },
    rollDice(socket) {
      console.log('Trying to roll the dice.');
      socket.emit('player-actions', {
        'rollDice': {
          pid: socket.id
        }
      }, response => {
        this.errorMessage = response.status;
        setTimeout(vc => vc.errorMessage = '', 3000, this);
      });
    },
    endturn(socket) {
      console.log('Trying to end my turn.');
      socket.emit('end-my-turn', {}, response => {
        this.errorMessage = response.status;
        setTimeout(vc => vc.errorMessage = '', 3000, this);
      });
    }
  },
  updated() {
    // We need to update our mutable copy whenever the board property is updated
    this.localMessage = this.message;
    this.localAction = this.action;
    this.selectedToBuild = this.selected;
    console.log(this.selected);
    this.resources = this.playerResources;
    this.roll = this.rollResult;
    this.phase = this.gamePhase;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#message-bar {
  padding-top: 20px;
  padding-bottom: 5px;
}
#message-bar > div {
  height: 22px;
}
.error-message {
  background-color: lightpink;
}
.status-message {
  background-color: lightgreen;
}
.controls-and-status {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
