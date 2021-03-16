<template>
  <table>
    <caption></caption>
    <tbody>
      <tr>
        <td t3Ind="0" @click="mark">
          {{localBoard[0]}}
        </td>
        <td t3Ind="1" class="vert" @click="mark">
          {{localBoard[1]}}
        </td>
        <td t3Ind="2" @click="mark">
          {{localBoard[2]}}
        </td>
      </tr>
      <tr>
        <td t3Ind="3" class="hori" @click="mark">
          {{localBoard[3]}}
        </td>
        <td t3Ind="4" class="hori vert" @click="mark">
          {{localBoard[4]}}
        </td>
        <td t3Ind="5" class="hori" @click="mark">
          {{localBoard[5]}}
        </td>
      </tr>
      <tr>
        <td t3Ind="6" @click="mark">
          {{localBoard[6]}}
        </td>
        <td t3Ind="7" class="vert" @click="mark">
          {{localBoard[7]}}
        </td>
        <td t3Ind="8" @click="mark">
          {{localBoard[8]}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  name: 'Grid',
  props: ['board'],
  setup() {
    // Inject stuff here
  },
  data() {
    return {
      // localBoard is our mutable copy of the game board
      localBoard: this.board
    };
  },
  methods: {
    mark(event) {
      console.log(event);
      const t3Ind = parseInt(event.target.attributes[0].value, 10);
      this.localBoard[t3Ind] = 'X';
    }
  },
  updated() {
    // We need to update our mutable copy whenever the board property is updated
    this.localBoard = this.board;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
td {
  width: 100px;
  height: 100px;
}
table {
  margin: 5px auto;
}
.vert {
  border-left: 2px solid black;
  border-right: 2px solid black;
}
.hori {
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}
.visible {
  display: none;
}
.invisible {
  display: none;
}
</style>
