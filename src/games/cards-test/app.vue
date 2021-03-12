<template>
  <div id="app">
    <p>Hello</p>
    <div id="end-turn">End turn</div>
  </div>
</template>

<script>

import { io } from "socket.io-client";

// TODO: Most of this networking stuff is going to go in Vue lifecycle hooks

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log(socket.id);
  // Send user name to server
  // Maybe not do this here?
  // Player will have to enter it first
  // Perhaps have player first go to a basic page where they enter their name and 
  // click join to come to this component
  socket.emit('send-user-name', 'User Name');
});

// We got the game state from the server
socket.on('game-state', (state) => {
  console.log(state);
});

socket.on('start-your-turn', () => {
  console.log('I am the active player!');
});

let endTurn = function () {
  document.getElementById('end-turn').onclick = function sendActions() {
    socket.emit('player-actions', {});
    console.log('I am done');
  }
}

window.addEventListener('load', endTurn );


export default {
  name: 'CardsTest',
  components: {
  }
}

</script>

<style>

</style>
