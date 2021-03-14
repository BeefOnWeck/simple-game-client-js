<template>
  <div>
    <form 
      id="login"
      v-on:submit.prevent="login"
    >
      <label>Enter a user name:</label>
      <input id="name" type="text">
      <input type="submit" value="Login">
    </form>
  </div>
</template>

<script>
// import { io } from "socket.io-client";

export default {
  name: 'Login',
  props: [],
  data(){
    return {
    }
  },
  methods: {
    login() {
      console.log(this.$options);
      this.socket.on('game-state', (state) => {
        console.log(state);
      });
      this.socket.on('start-your-turn', () => {
        console.log('I am the active player!');
      });
      this.socket.emit('send-user-name', this.name);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
