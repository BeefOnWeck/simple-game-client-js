<template>
  <div id="resource-list">
    <div v-for="(value, name) in localResources" v-bind:key="name" :class="`resource ${name}`">
      {{ name }}: {{ value }}
    </div>
  </div>
  <div class="status" id="message-bar">
    <div v-bind:class="{'status-message':localMessage!=''}">
      {{localMessage}}
    </div>
    <div v-bind:class="{'error-message':errorMessage!=''}">
      {{errorMessage}}
    </div>
  </div>
  <div id="dice-roll">
    Dice roll: {{roll}}
  </div>
  
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Status',
  components: {},
  props: [
    'message',
    'action',
    'selected',
    'resources',
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
      localMessage: this.message,
      localResources: this.resources,
      roll: this.rollResult,
      phase: this.gamePhase
    }

  },
  updated() {
    // We need to update our mutable copy whenever the board property is updated
    this.localMessage = this.message;
    this.localResources = this.resources;
    this.roll = this.rollResult;
    this.phase = this.gamePhase;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.resource {
  display: inline-block;
  margin: 5px;
  border: black;
}
.block {
  background-color: rgb(131, 73, 73);
}
.rock {
  background-color: rgb(104, 103, 103);
}
.timber {
  background-color:rgb(74, 110, 74);
}
.cereal {
  background-color: rgb(230, 192, 97);
}
.fiber {
  background-color: rgb(232, 232, 238);
}
#message-bar {
  padding-top: 20px;
  padding-bottom: 5px;
}
#message-bar > div {
  height: 22px;
}
.status-message {
  background-color: lightgreen;
}
.status {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
