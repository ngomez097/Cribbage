import { CardType } from "enum/CardType";

export default class CardModel {
  public type: CardType;
  public number: number;

  constructor(type: CardType, number: number) {
    this.type = type;
    this.number = number;
  }

  public show() {
    return `${this.number} ${this.type}`;
  }

  public equal(card: CardModel) {
    return this.number == card.number && this.type == card.type;
  }
}
