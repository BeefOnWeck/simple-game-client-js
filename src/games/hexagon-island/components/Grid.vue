<template>
  <div class="grid">
    <svg width="100%">
      <g>
        <polygon v-for="{poly, resource, idx} in hexagons" :key=idx :points=poly v-bind:class=resource></polygon>
        <circle v-for="{x, y, idx} in centroids" :key="idx" :cx=x :cy=y r="15" class="centroid"/>
        <text v-for="{x, y, number, idx} in centroids" :key="idx" :x=x :y=y dy="0.35em" text-anchor="middle" class="number">{{number}}</text> 
        <circle v-for="{x, y, idx} in nodes" :key="idx" :cx=x :cy=y r="3"/>
        <path v-for="line in lines" :key=line :d=line />
      </g>
    </svg>
  </div>
</template>

<script>


export default {
  name: 'Grid',
  props: ['board'],
  data(){
    return {
      centroids: this.board.centroids,
      nodes: this.board.nodes,
      hexagons: this.board.hexagons,
      numbers: this.board.numbers,
      roads: this.board.roads,
      lines: this.board.lines
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.brick {
  fill: darkred;
}
.ore {
  fill: gray;
}
.wood {
  fill:green;;
}
.grain {
  fill: goldenrod;
}
.sheep {
  fill: ghostwhite;
}
.desert {
  fill: khaki;
}
.grid svg g {
  transform: translate(50px, 50px);
}
/* .grid svg g polygon{
  fill:forestgreen;
} */
.grid svg g path{
  stroke: black;
}
.centroid {
  fill: white;
  stroke: black;
}
.number {
  font-weight: bold;
}
</style>
