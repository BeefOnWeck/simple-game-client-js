<template>
  <div class="grid">
    <svg :viewBox=svgViewBox>
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
  data() {
    return {
      svgViewBox: "0 0 100 100",
      centroids: this.board.centroids,
      nodes: this.board.nodes,
      hexagons: this.board.hexagons,
      numbers: this.board.numbers, // TODO: Not currently used; consider removing.
      roads: this.board.roads,
      lines: this.board.lines
    }
  },
  updated() {

    // Compute a bounding box that contains all of the nodes
    let nodeBounds = this.nodes.reduce((acc, cv) => {
      return [
        cv.x < acc[0] ? cv.x : acc[0],
        cv.x >= acc[1] ? cv.x : acc[1],
        cv.y < acc[2] ? cv.y : acc[2],
        cv.y >= acc[3] ? cv.y : acc[3] 
      ];
    },[9999, -9999, 9999, -9999]);

    // Compute the dimensions of the bounding box
    let widthX = (nodeBounds[1]-nodeBounds[0]);
    widthX = widthX > 0 ? widthX : 100;
    let widthY = (nodeBounds[3]-nodeBounds[2]);
    widthY = widthY > 0 ? widthY : 100;

    // Set the SVG viewBox, with a 10% margin on the borders
    this.svgViewBox = "" +
      (nodeBounds[0]-widthX/10) + " " +
      (nodeBounds[2]-widthY/10) + " " +
      widthX*1.2 + " " +
      widthY*1.2;

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.block {
  fill: darkred;
}
.rock {
  fill: gray;
}
.timber {
  fill:green;;
}
.cereal {
  fill: goldenrod;
}
.fiber {
  fill: ghostwhite;
}
.desert {
  fill: khaki;
}
/* .grid svg g { */
  /* transform: translate(100px, 100px); */
/* } */
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