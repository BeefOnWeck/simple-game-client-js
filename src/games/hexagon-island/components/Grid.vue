<template>
  <div class="grid">
    <svg :viewBox=svgViewBox>
      <g>
        <polygon v-for="({poly, resource}, idx) in hexagons" :key=idx :points=poly v-bind:class=resource></polygon>
        <circle v-for="{x, y, idx} in centroids" :key="idx" :cx=x :cy=y r="15" class="centroid"/>
        <text v-for="{x, y, number, idx} in centroids" :key="idx" :x=x :y=y dy="0.35em" text-anchor="middle" class="number">{{number}}</text> 
        <path v-for="line in lines" :key=line :d=line class="outlines"/>
        <path v-for="({path, color, opacity}, idx) in roads" :key=idx :d=path stroke-width=7 :stroke=color :stroke-opacity=opacity @click="selectRoad(`${idx}`)" v-bind:class="{ highlightroad: enableHighlight }"/>
        <circle v-for="{x, y, idx} in nodes" :key="idx" :cx=x :cy=y r="3"/>
        <polygon v-for="({x, y, color, opacity}, idx) in villages" :key=idx points="0,0 20,0 20,-15 10,-25 0,-15" :transform="`translate(${x-10},${y+10})`" :fill=color :fill-opacity=opacity @click="selectNode(`${idx}`)" v-bind:class="{ highlightnode: enableHighlight }"></polygon>
      </g>
    </svg>
    <div>
      <Controls 
        v-bind:message="message" 
        v-bind:action="action" 
        v-bind:selected="selected"
        v-bind:playerResources="playerResources"
        v-bind:rollResult="rollResult"
        v-bind:gamePhase="gamePhase"
        @reset-selected="onSelectionReset"
      />
    </div>
  </div>
</template>

<script>
import Controls from './Controls.vue'

export default {
  name: 'Grid',
  components: {
    Controls
  },
  props: [
    'board',
    'message',
    'action',
    'resources',
    'roll',
    'phase',
    'myTurn'
  ],
  data() {
    return {
      svgViewBox: "0 0 100 100",
      centroids: this.board.centroids,
      nodes: this.board.nodes,
      hexagons: this.board.hexagons,
      numbers: this.board.numbers, // TODO: Not currently used; consider removing.
      roads: this.board.roads,
      lines: this.board.lines,
      villages: this.board.villages,
      selected: {
        roads: new Set(),
        nodes: new Set()
      },
      playerResources: this.resources,
      rollResult: this.roll,
      gamePhase: this.phase,
      enableHighlight: false
    }
  },
  methods: {
    selectRoad(index) {
      console.log(index);
      this.selected.roads.add(index);
    },
    selectNode(index) {
      console.log(index);
      this.selected.nodes.add(index);
    },
    onSelectionReset(reset) {
      if (reset) {
        console.log('Reset selections!');
        this.selected.nodes.clear();
        this.selected.roads.clear();
      }
    }
  },
  updated() {

    this.villages = this.board.villages;
    this.playerResources = this.resources;
    this.rollResult = this.roll;
    this.gamePhase = this.phase;

    this.enableHighlight = this.myTurn && (this.action != 'roll-dice');

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
.outlines{
  stroke: black;
}
.centroid {
  fill: white;
  stroke: black;
}
.number {
  font-weight: bold;
}
path.highlightroad:hover {
  stroke-opacity: 1;
}
polygon.highlightnode:hover {
  fill-opacity: 1;
}
</style>
