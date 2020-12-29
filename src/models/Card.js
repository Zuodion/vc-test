import { CARD_STATUS_CLOSE } from "../utils/constants";

export default class Card {
  color;
  status = CARD_STATUS_CLOSE;
  constructor(color) {
    this.color = color;
  }
}