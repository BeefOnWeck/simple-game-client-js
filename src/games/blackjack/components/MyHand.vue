<template>
  <a v-for="card in cards" v-bind:key="card.rank">
    <Card v-bind:rank="card.rank" v-bind:suit="card.suit"/>
  </a>
</template>

<script>
import Card from './Card.vue';

export default {
  name: 'MyHand',
  components: {
    Card
  },
  props: [],
  setup() {

  },
  data() {
    return {
      cards: [
        {rank: 'K', suit: '♠︎'},
        {rank: '2', suit: '♥︎'}
      ]
    }

  },
  methods: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
