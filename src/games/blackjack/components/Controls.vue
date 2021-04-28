<template>
  <div class="message-bar">
    <div v-bind:class="{'status-message':localMessage!=''}">
      {{localMessage}}
    </div>
    <div v-bind:class="{'error-message':errorMessage!=''}">
      {{errorMessage}}
    </div>
  </div>
  <form 
    id="make-bet-control"
    v-on:submit.prevent="makeBet(socket)"
  >
    <input type="text" name="bet" v-model="bet">
    <input type="submit" value="Make Bet">
  </form>
  <!-- TODO: https://www.w3schools.com/css/css_navbar_horizontal.asp -->
  <form 
    id="make-move-control"
    v-on:submit.prevent="makeMove(socket,'Hit')"
  >
    <input type="submit" value="Hit">
  </form>
  <form 
    id="make-move-control"
    v-on:submit.prevent="makeMove(socket,'Stand')"
  >
    <input type="submit" value="Stand">
  </form> 
  <form 
    id="make-move-control"
    v-on:submit.prevent="makeMove(socket,'Double')"
  >
    <input type="submit" value="Double">
  </form>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Controls',
  components: {},
  props: ['message'],
  setup() {
    const socket = inject('socket');
    return {socket};
  },
  data() {
    return {
      bet: 10,
      localMessage: this.message,
      errorMessage: ''
    }

  },
  methods: {
    // TODO: Allow players to change their initial bets
    // TODO: Add controls for players to make their move (hit, etc.)
    // TODO: Better styling for controls (at least spacing)
    makeBet(socket) {
      console.log('Trying to make a bet.');
      socket.emit('player-actions', {
        'make-initial-bet': {
          pid: socket.id,
          amount: parseInt(this.bet, 10)
        }
      }, response => {
        this.errorMessage = response.status;
        setTimeout(vc => vc.errorMessage = '', 3000, this);
      });
    },
    makeMove(socket, move) {
      console.log('Trying to make a move.');
      socket.emit('player-actions', {
        'make-move': {
          pid: socket.id,
          move: move
        }
      }, response => {
        this.errorMessage = response.status;
        setTimeout(vc => vc.errorMessage = '', 3000, this);
      });
    }
  },
  updated() {
    // We need to update our mutable copy whenever the board property is updated
    this.localMessage = this.message;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.message-bar > div {
  height: 22px;
}
.error-message {
  background-color: lightpink;
}
.status-message {
  background-color: lightgreen;
}
</style>
