<template>
  <div id="app">
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
  </div>
</template>

<script>
import Hand from './components/Hand.vue'

export default {
  name: 'Blackjack',
  components: {
    Hand
  },
  data() {
    return {
      myHand: [
        {rank: 'K', suit: '♠︎', side: 'flippable'},
        {rank: '8', suit: '♣︎'}
      ],
      dealerHand: [
        {rank: null, suit: null, side: 'faceDown'},
        {rank: '2', suit: '♥︎'}
      ],
      otherPlayers: {
        player1: [
          {rank: null, suit: null, side: 'faceDown'},
          {rank: '6', suit: '♦︎'}
        ]
      }
    }
  },
  setup() {

  },
  created() {

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
