<template>
  <table>
    <caption></caption>
    <tbody>
      <tr>
        <td t3Ind="0" @click="mark">
          {{board[0]}}
        </td>
        <td t3Ind="1" class="vert" @click="mark">
          {{board[1]}}
        </td>
        <td t3Ind="2" @click="mark">
          {{board[2]}}
        </td>
      </tr>
      <tr>
        <td t3Ind="3" class="hori" @click="mark">
          {{board[3]}}
        </td>
        <td t3Ind="4" class="hori vert" @click="mark">
          {{board[4]}}
        </td>
        <td t3Ind="5" class="hori" @click="mark">
          {{board[5]}}
        </td>
      </tr>
      <tr>
        <td t3Ind="6" @click="mark">
          {{board[6]}}
        </td>
        <td t3Ind="7" class="vert" @click="mark">
          {{board[7]}}
        </td>
        <td t3Ind="8" @click="mark">
          {{board[8]}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Grid',
  props: [],
  setup() {
    let board = inject('board');
    return {board};
  },
  methods: {
    mark(event) {
      console.log(event);
      const t3Ind = parseInt(event.target.attributes[0].value, 10);
      this.board[t3Ind] = 'X';
    }
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
