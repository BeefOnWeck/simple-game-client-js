<template>
  <div class="grid">
    <svg :viewBox=svgViewBox>
      <filter id="shadow">
        <feDropShadow dx="0.5" dy="1.0" stdDeviation="0.5"/>
      </filter>
      <g :key="reRenderKey">
        <!-- Hexagons -->
        <polygon v-for="({poly, resource}, idx) in hexagons" :key=idx 
          :points=poly 
          v-bind:class="[resource, { highlightHexagon: enableHexagonHighlight }]"
          v-on="enableHexagonHighlight ? { click : () => selectHexagon(`${idx}`, socket) } : {}"
          >
        </polygon>
        <!-- Numbers -->
        <circle v-for="{x, y, idx} in centroids" :key="idx" :cx=x :cy=y r="27" class="centroid"/>
        <text v-for="{x, y, number, idx} in centroids" :key="idx" 
          :x=x :y=y dy="0.35em" text-anchor="middle" class="number">
          {{number}}
        </text>
        <!-- Hexagon edges -->
        <path v-for="line in lines" :key=line :d=line class="outlines"/>
        <!-- Brigand -->
        <path 
          :d="`${brigandSvg}`" 
          :transform="`scale(0.15) rotate(180) translate(${-1.0*brigand.x/0.15-280},${-1.0*brigand.y/0.15-320})`" 
          style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none"
        />
        <!-- Roads -->
        <path v-for="({path, color, opacity}, idx) in roads" :key=idx 
          :d=path stroke-width=14 :stroke=color :stroke-opacity=opacity 
          @click="selectRoad(`${idx}`)" 
          v-bind:class="[{ highlightroad: enableBuildHighlight }, {selectedroad : selected.roads.has(idx) }]"
        />
        <!-- Nodes -->
        <circle v-for="{x, y, idx} in nodes" :key="idx" 
          :cx=x :cy=y r="3"
        />
        <!-- Villages -->
        <path v-for="({x, y, color, opacity}, idx) in villages" :key=idx
          :d="`${villageSvg}`"
          :transform="`translate(${x-20},${y-25}) scale(2)`"
          :stroke=color
          :fill=color
          :stroke-opacity=opacity
          :fill-opacity=opacity
          style="filter:url(#shadow);"
          @click="selectNode(`${idx}`)" 
          v-bind:class="[{ highlightnode: enableBuildHighlight }, {selectednode : selected.nodes.has(idx) }]"
        />
      </g>
    </svg>
    <div id="controls">
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
import svgJson from './svg.json';

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
      brigandSvg: svgJson['brigand'],
      villageSvg: svgJson['village'],
      reRenderKey: 0
    }
  },
  methods: {
    selectRoad(index) {
      this.reRenderKey += 1;
      let indexInt = parseInt(index);
      if (this.selected.roads.has(indexInt)) {
        this.selected.roads.delete(indexInt);
      } else {
        this.selected.roads.add(indexInt);
      }
    },
    selectNode(index) {
      this.reRenderKey += 1;
      let indexInt = parseInt(index);
      if (this.selected.nodes.has(indexInt)) {
        this.selected.nodes.delete(indexInt);
      } else {
        this.selected.nodes.add(indexInt);
      }
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
      (nodeBounds[0]-widthX/20) + " " +
      (nodeBounds[2]-widthY/20) + " " +
      widthX*1.1 + " " +
      widthY*1.1;

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.block {
  fill: #a56666;
}
.rock {
  fill: #8d8c8c;
}
.timber {
  fill:#618961;
}
.cereal {
  fill: rgb(201, 174, 108);
}
.fiber {
  fill: rgb(232, 232, 238);
}
.desert {
  fill: rgb(175, 171, 108);
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
  font-size: 32px;
}
path.highlightroad:hover {
  stroke-opacity: 1;
}
path.selectedroad {
  stroke-opacity: 1;
}
path.highlightnode:hover {
  fill-opacity: 1;
  stroke-opacity: 1;
}
path.selectednode {
  fill-opacity: 1;
  stroke-opacity: 1;
}
polygon.highlightHexagon:hover {
  fill: black;
}
/* #controls {
  position: fixed;
  bottom: 0px;
  width: 95%;
  max-width: 800px;
} */
</style>
