<template>
  <div>
    <form 
      id="login"
      v-on:submit.prevent="login(socket)"
    >
      <label>Enter a player name:</label>
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
    return {socket};
  },
  data() {
    return {
      name: null
    };
  },
  methods: {
    login(socket) { // TODO: Disable after submitting
      console.log('Sending user name:', this.name);
      let vc = this;
      socket.emit('send-user-name', this.name, response => {
        console.log(response.status);
        vc.$emit('joined', {
          name: vc.name,
          status: response.status
        });
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
