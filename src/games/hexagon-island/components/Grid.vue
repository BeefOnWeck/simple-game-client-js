<template>
  <div class="grid">
    <svg :viewBox=svgViewBox>
      <g :key="reRenderKey">
        <polygon v-for="({poly, resource}, idx) in hexagons" :key=idx 
          :points=poly 
          v-bind:class="[resource, { highlightHexagon: enableHexagonHighlight }]"
          v-on="enableHexagonHighlight ? { click : () => selectHexagon(`${idx}`, socket) } : {}"
          >
        </polygon>
        <circle v-for="{x, y, idx} in centroids" :key="idx" :cx=x :cy=y r="15" class="centroid"/>
        <text v-for="{x, y, number, idx} in centroids" :key="idx" 
          :x=x :y=y dy="0.35em" text-anchor="middle" class="number">
          {{number}}
        </text> 
        <path v-for="line in lines" :key=line :d=line class="outlines"/>
        <path v-for="({path, color, opacity}, idx) in roads" :key=idx 
          :d=path stroke-width=7 :stroke=color :stroke-opacity=opacity 
          @click="selectRoad(`${idx}`)" 
          v-bind:class="[{ highlightroad: enableBuildHighlight }, {selectedroad : selected.roads.has(idx) }]"
        />
        <circle v-for="{x, y, idx} in nodes" :key="idx" 
          :cx=x :cy=y r="3"
        />
        <polygon v-for="({x, y, color, opacity}, idx) in villages" :key=idx 
          points="0,0 20,0 20,-15 10,-25 0,-15" 
          :transform="`translate(${x-10},${y+10})`" 
          :fill=color :fill-opacity=opacity 
          @click="selectNode(`${idx}`)" 
          v-bind:class="[{ highlightnode: enableBuildHighlight }, {selectednode : selected.nodes.has(idx) }]">
        </polygon>
        <rect :x=brigand.x :y=brigand.y width="10" height="50" transform="translate(0,-30)"/>
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
import { inject } from 'vue';

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
  setup() {
    const socket = inject('socket');
    return {socket};
  },
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
      brigand: this.board.brigand,
      selected: {
        roads: new Set(),
        nodes: new Set()
      },
      playerResources: this.resources,
      rollResult: this.roll,
      gamePhase: this.phase,
      enableBuildHighlight: false,
      enableHexagonHighlight: false,
      reRenderKey: 0
    }
  },
  methods: {
    selectRoad(index) {
      this.selected.roads.add(parseInt(index));
      this.reRenderKey += 1;
      console.log(this.selected.roads);
      // TODO: Toggle highlighting for selected roads and nodes
    },
    selectNode(index) {
      this.reRenderKey += 1;
      this.selected.nodes.add(parseInt(index));
    },
    selectHexagon(index, socket) {
      socket.emit('player-actions', {
        'moveBrigand': {
          pid: socket.id,
          hexInd: index
        }
      }, response => {
        console.log(response.status);
      });
    },
    onSelectionReset(reset) {
      if (reset) {
        this.selected.nodes.clear();
        this.selected.roads.clear();
      }
    }
  },
  updated() {

    this.villages = this.board.villages;
    this.brigand = this.board.brigand;
    this.playerResources = this.resources;
    this.rollResult = this.roll;
    this.gamePhase = this.phase;

    this.enableBuildHighlight = this.myTurn && (this.action.includes('buildStuff') || this.action.includes('setupVillagesAndRoads'));
    this.enableHexagonHighlight = this.myTurn && this.action.includes('moveBrigand');

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
  fill:green;
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
path.selectedroad {
  stroke-opacity: 1;
}
polygon.highlightnode:hover {
  fill-opacity: 1;
}
polygon.selectednode {
  fill-opacity: 1;
}
polygon.highlightHexagon:hover {
  fill: black;
}
</style>
