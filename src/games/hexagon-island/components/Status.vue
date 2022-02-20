<template>
  <div id="resource-list">
    <div v-for="(value, name) in localResources" v-bind:key="name" :class="`resource ${name}`">
      {{ name }}: {{ value }}
    </div>
  </div>
  <div class="status-fields">
    <div id="dice-roll">
      Dice: {{rollResult}}
    </div>
    <div id="active-player">
      Turn: {{activePlayerName}}
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Status',
  components: {},
  props: [
    'message',
    'resources',
    'roll',
    'phase',
    'activePlayer'
  ],
  emits: ['reset-selected'],
  setup() {
    const socket = inject('socket');
    return {socket};
  },
  data() {
    return {
      localMessage: this.message,
      localResources: this.resources,
      rollResult: this.roll,
      gamePhase: this.phase,
      activePlayerName: this.activePlayer
    }

  },
  updated() {
    // We need to update our mutable copy whenever the board property is updated
    this.localMessage = this.message;
    this.localResources = this.resources;
    this.rollResult = this.roll;
    this.gamePhase = this.phase;
    this.activePlayerName = this.activePlayer;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.resource {
  display: inline-block;
  margin: 3px;
  padding: 5px;
  border: black;
  font-weight: bolder;
  border-radius: 5px;
  font-size: 20px;
}
.block {
  background-color: #a56666;
  color: whitesmoke;
}
.rock {
  background-color: #8d8c8c;
  color: whitesmoke;
}
.timber {
  background-color:#618961;
  color: whitesmoke;
}
.cereal {
  background-color: rgb(230, 192, 97);
}
.fiber {
  background-color: rgb(232, 232, 238);
}
#message-bar {
  padding-top: 10px;
  padding-bottom: 5px;
}
#message-bar > div {
  min-height: 27px;
  font-size: 20px;
  font-weight: bold;
  border: thin;
  border-style: solid;
}
.status-message {
  background-color: lightgreen;
}
.status-fields {
  background: #cccfea;
  margin-top: 10px;
  border: thin;
  border-style: solid;
}
.status-fields > div {
  font-size: 20px;
  font-weight: bolder;
  display: inline-block;
}
#dice-roll {
  margin-right: 20px;
}
#active-player {
  margin-left: 20px;
}
</style>
