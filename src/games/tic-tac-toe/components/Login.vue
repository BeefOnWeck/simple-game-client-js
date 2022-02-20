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
      name: window.localStorage.getItem('sgc-name') ?? null
    };
  },
  methods: {
    login(socket) { 
      let vc = this;
      socket.emit('reconnect-user-name', vc.name, response => {
        if (response.status == 'Cannot reconnect; no matching user.') {
          socket.emit('send-user-name', vc.name, response => {
            vc.$emit('joined', {
              name: vc.name,
              status: response.status
            });
          });
        } else {
          vc.$emit('joined', {
            name: vc.name,
            status: response.status
          });
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
