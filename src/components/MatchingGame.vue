<template>
  <div class="matching-game">
    <div class="matching-game-header">
      <button @click="resetGame()">RESET</button>
      <div class="moves-count">{{ movesCount }}</div>
      <div class="timer">
        {{ getTimeString }}
      </div>
    </div>
    <div class="matching-game-action-zone">
      <div v-if="isStartMenuShow" class="start-menu">
        <button @click="startGame()">START</button>
      </div>
      <div
        class="cards-list"
        :style="{ 'pointer-events': isGameLocked ? 'initial' : 'none' }"
      >
        <card-item
          v-for="(card, index) in cards"
          :card="card"
          :key="index"
          :cardIndex="index"
          :selectCard="selectCard"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  CARD_STATUS_CLOSE,
  CARD_STATUS_FOUND,
  CARD_STATUS_OPEN,
  COLORS_LIST,
  PAUSE_TIME,
} from "../utils/constants";
import Card from "../models/Card";
import shuffleArray from "../utils/shuffleArray";
import CardItem from "./CardItem";
export default {
  components: {
    CardItem,
  },
  data() {
    return {
      isStartMenuShow: true,
      isGameLocked: false,
      cards: [],
      comparingArray: [],
      time: 0,
      timer: null,
      movesCount: 0,
    };
  },
  methods: {
    selectCard(cardIndex) {
      if (this.cards[cardIndex].status !== CARD_STATUS_CLOSE) return;
      this.cards[cardIndex].status = CARD_STATUS_OPEN;
      if (this.comparingArray.length === 0) {
        this.comparingArray.push(this.cards[cardIndex]);
      } else {
        this.comparingArray.push(this.cards[cardIndex]);
        this.checkForComparing();
      }
    },
    async checkForComparing() {
      this.lockGame();
      await this.$nextTick();
      setTimeout(async() => {
        if (this.comparingArray[0].color === this.comparingArray[1].color) {
          this.comparingArray[0].status = CARD_STATUS_FOUND;
          this.comparingArray[1].status = CARD_STATUS_FOUND;
        } else {
          this.comparingArray[0].status = CARD_STATUS_CLOSE;
          this.comparingArray[1].status = CARD_STATUS_CLOSE;
        }
        this.comparingArray = [];
        this.movesCount++;
        await this.$nextTick();
        this.unlockGame();
        this.checkForWin();
      }, PAUSE_TIME);
    },
    lockGame() {
      this.isGameLocked = false;
    },
    unlockGame() {
      this.isGameLocked = true;
    },
    resetGame() {
      clearInterval(this.timer);
      this.time = 0;
      this.movesCount = 0;
      this.cards = [];
      this.comparingArray = [];
      for (const color of COLORS_LIST) {
        let firstCardOfPair = new Card(color);
        let secondCardOfPair = new Card(color);
        this.cards.push(firstCardOfPair);
        this.cards.push(secondCardOfPair);
      }
      shuffleArray(this.cards);
      this.lockGame();
      this.isStartMenuShow = true;
    },
    startGame() {
      this.timer = setInterval(() => this.time++, 1000);
      this.unlockGame();
      this.isStartMenuShow = false;
    },
    checkForWin() {
      if (this.cards.filter(card => card.status === CARD_STATUS_FOUND).length === COLORS_LIST.length*2) {
        clearInterval(this.timer);
        alert('congratulations');
      }
    }
  },
  computed: {
    getTimeString() {
      let dateTime = new Date(this.time * 1000);
      return `${('0' + dateTime.getMinutes()).slice(-2)}:${('0' + dateTime.getSeconds()).slice(-2)}`
    },
  },
  mounted() {
    this.resetGame();
  },
};
</script>

<style lang="scss" scoped>
.matching-game {
  width: 750px;
  .matching-game-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .matching-game-action-zone {
    position: relative;
    .start-menu {
      position: absolute;
      height: 100px;
      width: 200px;
      top: calc(50% - 50px);
      left: calc(50% - 100px);
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        cursor: pointer;
        background-color: black;
        font-size: 30px;
        color: white;
        border: none;
        text-align: center;
      }
    }
    .cards-list {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
    }
  }
}
</style>