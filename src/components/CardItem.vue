<template>
  <div
    class="card"
    :style="{ 'background-color': calculateBackgroundColor }"
    @click="selectCard(cardIndex)"
  ></div>
</template>

<script>
import Card from "../models/Card";
import { CARD_STATUS_FOUND, CARD_STATUS_OPEN } from "../utils/constants";
export default {
  props: {
    card: Card,
    cardIndex: Number,
    selectCard: Function,
  },
  computed: {
    calculateBackgroundColor() {
      switch (this.card.status) {
        case CARD_STATUS_OPEN:
          return this.card.color;
        case CARD_STATUS_FOUND:
          return this.card.color + '88';
        default:
          return "#000000";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  height: 140px;
  width: 140px;
  margin: 5px;
  border-radius: 5px;
}
</style>