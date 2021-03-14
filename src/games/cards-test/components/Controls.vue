<template>
  <div>
    <form 
      id="controls"
      v-on:submit.prevent="endturn"
    >
      <input type="submit" value="End Turn">
    </form>
  </div>
</template>

<script>

export default {
  name: 'Controls',
  props: ['socket'],
  data(){
    return {
    }
  },
  methods: {
    endturn() {
      this.socket.emit('player-actions', {});
      console.log('I am done');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
