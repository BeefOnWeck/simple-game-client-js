<template>
  <div id="app">
    <h1>Blackjack</h1>
    <MyHand/>
  </div>
</template>

<script>
import MyHand from './components/MyHand.vue'

export default {
  name: 'Blackjack',
  components: {
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
