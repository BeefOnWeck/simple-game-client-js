<template>
  <div id="app">
    <h1>Tic-Tac-Toe</h1>
    <Login/>
    <Grid/>
    <Controls/>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import Grid from './components/Grid.vue'
import Controls from './components/Controls.vue'

export default {
  name: 'Tic-Tac-Toe',
  components: {
    Login,
    Grid,
    Controls
  },
  mounted() {
    console.log(this);
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
</style>
