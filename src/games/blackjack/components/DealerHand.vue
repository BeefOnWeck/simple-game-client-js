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
  name: 'DealerHand',
  components: {
    Card
  },
  props: [],
  setup() {

  },
  data() {
    return {
      cards: [
        {rank: null, suit: null, side: 'faceDown'},
        {rank: 'K', suit: '♠︎', side: 'flippable'},
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
