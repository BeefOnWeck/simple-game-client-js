<template>
  <form 
    id="make-bet-control"
    v-on:submit.prevent="makeBet(socket)"
  >
    <input type="submit" value="Make Bet">
  </form>
  <form 
    id="make-move-control"
    v-on:submit.prevent="makeMove(socket)"
  >
    <input type="submit" value="Hit">
    <input type="submit" value="Stand">
    <input type="submit" value="Double down">
  </form>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Controls',
  components: {},
  props: ['actions'],
  setup() {
    const socket = inject('socket');
    return {socket};
  },
  data() {
    return {
      cards: this.hand
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
          amount: 10
        }
      }, response => {
        console.log(response.status);
      });
    },
    makeMove(socket) {
      console.log('Trying to make a move.');
      console.log(this);
      socket.emit('player-actions', {
        'make-move': {
          pid: socket.id,
          move: 'hit'
        }
      }, response => {
        console.log(response.status);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
