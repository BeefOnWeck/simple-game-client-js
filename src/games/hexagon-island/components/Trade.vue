<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <div>
            Trade 3:1
          </div>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close modal"
          >
            x
          </button>
        </header>
        <section class="modal-body" id="modalDescription">
          <div>
            <div class="column">
              <div class="row">Have x3:</div>
              <div @click="trade.have='block'" v-bind:class="[{selected: trade.have=='block'}, 'row', 'resource']">Block</div>
              <div @click="trade.have='timber'" v-bind:class="[{selected: trade.have=='timber'}, 'row', 'resource']">Timber</div>
              <div @click="trade.have='fiber'" v-bind:class="[{selected: trade.have=='fiber'}, 'row', 'resource']">Fiber</div>
              <div @click="trade.have='cereal'" v-bind:class="[{selected: trade.have=='cereal'}, 'row', 'resource']">Cereal</div>
              <div @click="trade.have='rock'" v-bind:class="[{selected: trade.have=='rock'}, 'row', 'resource']">Rock</div>
            </div>
            <div class="column">
              <div class="row">Want x1:</div>
              <div @click="trade.want='block'" v-bind:class="[{selected: trade.want=='block'}, 'row', 'resource']">Block</div>
              <div @click="trade.want='timber'" v-bind:class="[{selected: trade.want=='timber'}, 'row', 'resource']">Timber</div>
              <div @click="trade.want='fiber'" v-bind:class="[{selected: trade.want=='fiber'}, 'row', 'resource']">Fiber</div>
              <div @click="trade.want='cereal'" v-bind:class="[{selected: trade.want=='cereal'}, 'row', 'resource']">Cereal</div>
              <div @click="trade.want='rock'" v-bind:class="[{selected: trade.want=='rock'}, 'row', 'resource']">Rock</div>
            </div>
          </div>
        </section>
        <footer class="modal-footer">
          <button
            type="button"
            class="btn-footer"
            @click="tradeAction(socket)"
            aria-label="Trade"
          >
            Trade
          </button>
          <button
            type="button"
            class="btn-footer"
            @click="close"
            aria-label="Close modal"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
  import { inject } from 'vue';

  export default {
    name: 'Trade',
    data() {
      return {
        trade: {
          have: '',
          want: ''
        }
      }
    },
    setup() {
      const socket = inject('socket');
      return {socket};
    },
    methods: {
      tradeAction(socket) {
        socket.emit('player-actions', {
          trade: {
            pid: socket.id,
            have: this.trade.have,
            want: this.trade.want
          }
        }, response => {
          console.log(response);
          this.$emit('error');
        });
        this.trade.have = '';
        this.trade.want = '';
        this.$emit('close');
      },
      close() {
        this.trade.have = '';
        this.trade.want = '';
        this.$emit('close');
      },
    },
  };
</script>

<style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }
  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }
  .modal-header {
    position: relative;
    border-bottom: 1px solid black;
    color: black;
    justify-content: space-between;
    font-size: 16px;
  }
  .modal-footer {
    border-top: 1px solid black;
    flex-direction: column;
  }
  .modal-body {
    position: relative;
    padding: 20px 10px;
  }
  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: black;
    background: transparent;
  }
  .btn-footer {
    color: black;
    background: white;
    border: 1px solid black;
    border-radius: 5px;
    margin: 5px;
    font-size: 16px;
  }
  .modal-fade-enter,
  .modal-fade-leave-to {
    opacity: 0;
  }
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity .5s ease;
  }
  .column {
    display: inline-block;
    padding-left: 20px;
    padding-right: 20px;
  }
  .row {
    text-align: left;
    font-weight: bold;
  }
  .resource {
    border: thin;
    border-style: solid;
    border-radius: 5px;
    margin: 10px;
    padding: 3px;
  }
  .selected {
    border-style: groove;
    background: lightgray;
  }
</style>