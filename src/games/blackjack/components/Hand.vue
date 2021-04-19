<template>
  <a v-for="card in cards" v-bind:key="card.rank">
    <Card v-bind:rank="card.rank" 
      v-bind:suit="card.suit" 
      v-bind:side="card.side"/>
  </a>
</template>

<script>
import Card from './Card.vue';

export default {
  name: 'Hand',
  components: {
    Card
  },
  props: ['hand'],
  setup() {

  },
  data() {
    return {
      cards: this.hand
    }

  },
  methods: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
