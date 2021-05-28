<template>
  <div class="controls-and-status" id="message-bar">
    <div v-bind:class="{'status-message':localMessage!=''}">
      {{localMessage}}
    </div>
    <div v-bind:class="{'error-message':errorMessage!=''}">
      {{errorMessage}}
    </div>
  </div>
  <form 
    id="build-control"
    v-on:submit.prevent="build(socket)"
  >
    <input type="submit" value="Build Selected">
  </form>
  <form 
    id="end-turn-control"
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
    'selected'
  ],
  setup() {
    const socket = inject('socket');
    return {socket};
  },
  data() {
    return {
      localAction: this.action,
      localMessage: this.message,
      errorMessage: '',
      selectedToBuild: this.selected
    }

  },
  methods: {
    build(socket) {
      console.log('Trying to build.');
      socket.emit('player-actions', {
        'setup-villages-and-roads': {
          pid: socket.id,
          nodes: [...this.selectedToBuild.nodes],
          roads: [...this.selectedToBuild.roads]
        }
      }, response => {
        this.errorMessage = response.status;
        setTimeout(vc => vc.errorMessage = '', 3000, this);
      });
      this.selectedToBuild.nodes.clear();
      this.selectedToBuild.roads.clear();
    },
    endturn(socket) {
      console.log('Trying to end my turn.');
      socket.emit('end-my-turn', {}, response => {
        console.log(response.status);
      });
    }
  },
  updated() {
    // We need to update our mutable copy whenever the board property is updated
    this.localMessage = this.message;
    this.localAction = this.action;
    this.selectedToBuild = this.selected;
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
