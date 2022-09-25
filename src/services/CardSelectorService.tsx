import { CardType } from "enum/CardType";
import CardModel from "model/CardModel";
import Utils from "utils/Utils";

class CardSelectorService {
  public cards = {
    Trébol: [new CardModel(CardType.CLUBS, 1)],
    Diamantes: [new CardModel(CardType.DIAMONDS, 1)],
    Corazones: [new CardModel(CardType.HEARTS, 1)],
    Picas: [new CardModel(CardType.SPADES, 1)],
  };

  constructor() {
    for (let i = 2; i <= 13; i++) {
      this.cards.Trébol.push(new CardModel(CardType.CLUBS, i));
      this.cards.Diamantes.push(new CardModel(CardType.DIAMONDS, i));
      this.cards.Corazones.push(new CardModel(CardType.HEARTS, i));
      this.cards.Picas.push(new CardModel(CardType.SPADES, i));
    }
  }

  public debug = false;

  public getPoints(cards: CardModel[]) {
    this.validateCards(cards);
    const points = this.valuatePoints(cards);
    return points;
  }

  public printGame(cards: CardModel[]) {
    this.validateCards(cards);
    console.log("==========================");
    cards.forEach((c, index) => console.log(index + 1 + " - " + c.show()));
    const points = this.getPoints(cards);
    console.log("--------------------------");
    console.log(`Points: ${points}`);
    console.log("==========================");
  }

  public validateCards(cards: CardModel[]) {
    if (cards.length != 5) {
      throw new Error("Required 5 cards");
    }

    const cards_set: CardModel[] = [];
    for (const card of cards) {
      if (this.isInside(card, cards_set)) {
        throw new Error("invalid cards array");
      }
      cards_set.push(card);
    }
  }

  public valuatePoints(cards: CardModel[]) {
    let points = 0;
    let total;
    this.debug && console.log("|PAIRS|");
    total = this.getPairPoints(cards);
    this.debug && console.log("|Total = " + total);
    this.debug && console.log("-------------");
    points += total;

    this.debug && console.log("|15|");
    total = this.getFifteensPoints(cards);
    this.debug && console.log("|Total = " + total);
    this.debug && console.log("-------------");
    points += total;

    this.debug && console.log("|STAIRS|");
    total = this.getStairPoints(cards);
    this.debug && console.log("|Total = " + total);
    points += total;

    return points;
  }

  public getPairPoints(cards: CardModel[]): number {
    let points = 0;
    for (let i = 0; i < cards.length - 1; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        if (cards[i].number == cards[j].number) {
          this.debug && console.log(`|${i + 1}-${j + 1}`);
          points += 2;
        }
      }
    }
    return points;
  }

  public getPairCards(cards: CardModel[]) {
    const pairs: CardModel[][] = [];
    for (let i = 0; i < cards.length - 1; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        if (cards[i].number == cards[j].number) {
          // this.debug && console.log(`|${i + 1}-${j + 1}`);
          pairs.push([cards[i], cards[j]]);
        }
      }
    }
    return pairs;
  }

  public getFifteensPoints(cards: CardModel[]): number {
    let cards_number: number[] = [];
    let points = 0;

    cards_number.push(...cards.map(this.getCardNumberFifteen));

    cards_number = cards_number.sort((a, b) => b - a);
    this.debug && console.log(cards_number);

    for (let i = 0; i < cards_number.length - 1; i++) {
      points += this.evaluateFifteen(cards_number, i);
    }

    return points;
  }

  public getFifteensCards(cards: CardModel[]): CardModel[][] {
    let cards_res: CardModel[][] = [];

    for (let i = 0; i < cards.length - 1; i++) {
      cards_res.push(...this.getFifteenCardPlays(cards, i));
    }
    return cards_res;
  }

  public getStairPoints(cards: CardModel[]) {
    let cards_number: number[] = [];
    let stair_path = "";

    for (const card of cards) {
      cards_number.push(card.number);
    }
    cards_number = cards_number.sort((a, b) => a - b);
    const cards_count_map = new Map();
    cards_number.forEach((num) =>
      cards_count_map.set(num, (cards_count_map.get(num) || 0) + 1)
    );
    this.debug && console.log(cards_number);
    cards_number = [...new Set(cards_number).values()];

    for (let i = 0; i < cards_number.length - 2; i++) {
      if (cards_number[i] + 1 == cards_number[i + 1]) {
        stair_path = this.evaluateStair(cards_number, i);
      }

      if (stair_path.trim().length > 0) {
        stair_path = stair_path.slice(1);
        const parts = stair_path.split(",");
        let points = parts.length;
        this.debug && console.log(stair_path);

        for (const num of parts) {
          points *= cards_count_map.get(Number(num));
        }

        return points;
      }
    }
    return 0;
  }

  public getStairCardsPlays(cards: CardModel[]): CardModel[][] {
    let cards_number: number[] = [];
    let stair_path = "";
    let plays: CardModel[][] = [];

    for (const card of cards) {
      cards_number.push(card.number);
    }
    console.log(cards_number);
    cards_number = cards_number.sort((a, b) => a - b);
    this.debug && console.log(cards_number);

    cards_number = [...new Set(cards_number).values()];

    const cards_count_map: Map<number, CardModel[]> = new Map();
    cards.forEach((card) =>
      cards_count_map.set(card.number, [
        ...(cards_count_map.get(card.number) || []),
        card,
      ])
    );

    for (let i = 0; i < cards_number.length - 2; i++) {
      if (cards_number[i] + 1 == cards_number[i + 1]) {
        stair_path = this.evaluateStair(cards_number, i);
      }

      if (stair_path.trim().length > 0) {
        stair_path = stair_path.slice(1);
        const parts = stair_path.split(",");
        this.debug && console.log(stair_path);
        plays = [[]];

        for (const num of parts) {
          const initial_play = plays;
          const num_cards = cards_count_map.get(Number(num));
          if (num_cards!.length > 1) {
            for (
              let copy_index = 1;
              copy_index < num_cards!.length;
              copy_index++
            ) {
              plays = [...plays, ...Utils.copyNestedArray(initial_play)];
            }
            for (
              let card_index = 0;
              card_index < num_cards!.length;
              card_index++
            ) {
              const single_card_plays = plays.length / num_cards!.length;
              const startPlayIndex = card_index * single_card_plays;
              const endPlayIndex = (card_index + 1) * single_card_plays;
              for (
                let play_index = startPlayIndex;
                play_index < endPlayIndex;
                play_index++
              ) {
                plays[play_index].push(num_cards![card_index]);
              }
            }
          } else {
            plays.forEach((play) => play.push(...num_cards!));
          }
        }
      }
    }

    return plays;
  }

  public getFifteenCardPlays(
    cards: CardModel[],
    startPoint = 0,
    sum = 0,
    path: CardModel[] = []
  ): CardModel[][] {
    sum += this.getCardNumberFifteen(cards[startPoint]);
    const plays: CardModel[][] = [];

    for (let i = startPoint + 1; i < cards.length; i++) {
      const sum_aux = this.getCardNumberFifteen(cards[i]) + sum;
      if (sum_aux == 15) {
        plays.push([...path, cards[startPoint], cards[i]]);
      } else if (sum_aux < 15)
        plays.push(
          ...this.getFifteenCardPlays(cards, i, sum, [
            ...path,
            cards[startPoint],
          ])
        );
    }

    return plays;
  }

  public getCardNumberFifteen(card: CardModel) {
    return card.number > 10 ? 10 : card.number;
  }

  public evaluateStair(
    numbers: number[],
    startPoint = 0,
    count = 1,
    path = ""
  ): string {
    if (startPoint >= numbers.length) {
      return count >= 3 ? path : "";
    }
    if (numbers[startPoint] + 1 != numbers[startPoint + 1]) {
      return count >= 3 ? path + "," + numbers[startPoint] : "";
    }

    return this.evaluateStair(
      numbers,
      startPoint + 1,
      count + 1,
      path + "," + numbers[startPoint]
    );
  }

  public evaluateFifteen(
    numbers: number[],
    startPoint = 0,
    sum = 0,
    path = ""
  ) {
    sum += numbers[startPoint];
    let points = 0;

    for (let i = startPoint + 1; i < numbers.length; i++) {
      const sum_aux = numbers[i] + sum;
      if (sum_aux == 15) {
        points += 2;
        this.debug &&
          console.log(
            "|" + (path + ",").slice(1) + (startPoint + 1) + "," + (i + 1)
          );
      } else if (sum_aux < 15)
        points += this.evaluateFifteen(
          numbers,
          i,
          sum,
          path + "," + (startPoint + 1)
        );
    }

    return points;
  }

  public isInside(card: CardModel, cards: CardModel[]) {
    return cards.find((c) => c.equal(card)) != null;
  }
}

export default new CardSelectorService();
