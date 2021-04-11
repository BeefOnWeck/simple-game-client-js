<template>
  <div id="app">
    <h1>Blackjack</h1>
    <h2>Dealer Hand</h2>
    <DealerHand/>
    <h2>Player 1</h2>
    <MyHand/>
    <h2>Your Hand</h2>
    <MyHand/>
  </div>
</template>

<script>
import DealerHand from './components/DealerHand.vue'
import MyHand from './components/MyHand.vue'

export default {
  name: 'Blackjack',
  components: {
    DealerHand,
    MyHand
  },
  data() {

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
