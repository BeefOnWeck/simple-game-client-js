<template>
  <div>
    <form 
      id="login"
      v-on:submit.prevent="login(socket)"
    >
      <label>Enter a user name:</label>
      <input id="name" type="text" v-model="name">
      <input type="submit" value="Login">
    </form>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Login',
  props: [],
  setup() {
    const socket = inject('socket');
    console.log(socket);
    return {socket};
  },
  data() {
    return {
      name: null
    };
  },
  methods: {
    login(socket) {
      socket.on('game-state', (state) => {
        console.log(state);
      });
      socket.on('start-your-turn', () => {
        console.log('I am the active player!');
      });
      console.log(this);
      socket.emit('send-user-name', this.name);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
