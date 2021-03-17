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
      socket.emit('end-my-turn', {});
      console.log('I am done');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
