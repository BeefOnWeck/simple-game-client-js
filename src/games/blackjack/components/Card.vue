<template>
  <div class="card">
    <div class="card-topleft">
      <div class="card-corner-rank">
       {{rank}}
      </div>
      <div class="card-corner-suit">
       {{suit}}
      </div>
    </div>
    <div class="card-bottomright">
      <div class="card-corner-rank">
        {{rank}}
      </div>
      <div class="card-corner-suit">
        {{suit}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Card',
  props: ['rank', 'suit'],
  setup() {

  },
  data() {

  },
  methods: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  display: inline-block;
  position: relative;
  width: 5em;
  height: 7em;
  background-color: #ffffff;
  box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
  border-radius: 0.25em;
  margin-right: 0.25em;
  margin-left: 0.25em;
}
.card.red {
  color: red;
}
.card-topleft {
  position: absolute;
  top: 0.5em;
  left: 0.75em;
}
.card-bottomright {
  position: absolute;
  bottom: 0.5em;
  right: 0.75em;
  transform: rotate(180deg);
}
.card-corner-rank, .card-corner-suit {
  width: 1em;
  text-align: center;
  transform: translate(-50%, 0);
}
</style>
