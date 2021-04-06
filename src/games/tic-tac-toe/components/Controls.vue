<template>
  <div>
    <form 
      id="controls"
      v-on:submit.prevent="endturn(socket)"
    >
      <input type="submit" value="End Turn">
    </form>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Controls',
  props: [],
  setup() {
    const socket = inject('socket');
    return {socket};
  },
  methods: {
    endturn(socket) {
      console.log('Trying to end my turn.');
      socket.emit('end-my-turn', {}, response => {
        console.log(response.status);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
