import Card from "components/card/Card";
import CardModel from "model/CardModel";
import { useState } from "react";
import CardSelectorService from "services/CardSelectorService";
import style from "./CardSelector.module.scss";

export function CardSelector() {
  const cards: { [key: string]: CardModel[] } = CardSelectorService.cards;
  let [selectedCards, setSelectedCards] = useState<CardModel[]>([]);
  let [pairs, setPairs] = useState<CardModel[][]>([]);
  let [fifteenPlays, setFifteenPlays] = useState<CardModel[][]>([]);
  let [stairPlays, setStairPlays] = useState<CardModel[][]>([]);
  let [points, setPoints] = useState(0);
  let [pointsPair, setPointsPair] = useState(0);
  let [pointsFifteen, setPointsFifteen] = useState(0);
  let [pointsStair, setPointsStair] = useState(0);

  const selectCard = (card: CardModel) => {
    const index = selectedCards.findIndex(card.equal.bind(card));
    if (index != -1) {
      removeCard(card);
      return;
    }

    if (selectedCards.length == 5) {
      clearSelectedCards()
    }
    
    selectedCards.push(card);
    setSelectedCards([...selectedCards]);
    
    // Calcular las jugadas
    if(selectedCards.length == 5) {
      // setPoints(CardSelectorService.getPoints(selectedCards))
      setPairs(pairs = CardSelectorService.getPairCards(selectedCards))
      setFifteenPlays(fifteenPlays = CardSelectorService.getFifteensCards(selectedCards))
      setStairPlays(stairPlays = CardSelectorService.getStairCardsPlays(selectedCards))

      pointsPair = pairs.reduce((prev) => prev + 2, 0)
      pointsFifteen = fifteenPlays.reduce((prev) => prev + 2, 0)
      pointsStair = stairPlays.reduce((prev, play) => prev + play.length, 0)

      setPointsPair(pointsPair)
      setPointsFifteen(pointsFifteen)
      setPointsStair(pointsStair)
      setPoints(pointsPair + pointsFifteen + pointsStair)
    }
  };

  const clearPoints = () => {
    setPoints(0)
    setPointsPair(0)
    setPointsFifteen(0)
    setPointsStair(0)
    setPairs([])
    setFifteenPlays([])
    setStairPlays([])
  }

  const removeCard = (card: CardModel) => {
    const index = selectedCards.findIndex(card.equal.bind(card));
    if (index == -1) return;

    selectedCards.splice(index, 1);
    setSelectedCards([...selectedCards]);
    clearPoints()
  };

  const isCardSelected = (card: CardModel) => {
    return selectedCards.findIndex(card.equal.bind(card)) != -1;
  };

  const clearSelectedCards = () => {
    selectedCards = []
    setSelectedCards(selectedCards);
    clearPoints();
  }

  return (
    <>
      {/* SELECTED CARDS  */}
      <div className={`${style.game_container}`}>
        {/* Cartas seleccionadas */}
        <div>
          <h3>Cartas Seleccionadas <button onClick={clearSelectedCards}>Borrar</button></h3>
          <div className={`${style.selected_card_container}`}>
            {selectedCards.map((card: CardModel) => (
              <span onClick={() => removeCard(card)}>
                <Card number={card.number} type={card.type} />
              </span>
            ))}
          </div>
        </div>

        {/* Resultado */}
        <div>
            <h2>Puntos: {points}</h2>
            <div className={style.plays_container}>
              <span>
                <h4>Pares = {pointsPair}</h4>
                <div className={style.pairs_container}>
                  {pairs.map(([card1, card2]) => 
                    <span className="d-flex gap-1">
                      <Card number={card1.number} type={card1.type} fontSize={15}/>
                      <Card number={card2.number} type={card2.type} fontSize={15}/>
                    </span>
                  )}
                </div>
              </span>
              <span>
                <h4>Quince = {pointsFifteen}</h4>
                <div className={style.pairs_container}>
                  {fifteenPlays.map((cards) => 
                    <span className="d-flex gap-1">
                      {cards.map(card =>
                        <Card number={card.number} type={card.type} fontSize={15}/>
                      )}
                    </span>
                  )}
                </div>
              </span>
              <span>
                <h4>Escalera = {pointsStair}</h4>
                <div className={style.pairs_container}>
                  {stairPlays.map((cards) => 
                    <span className="d-flex gap-1">
                      {cards.map(card =>
                        <Card number={card.number} type={card.type} fontSize={15}/>
                      )}
                    </span>
                  )}
                </div>
              </span>
            </div>
        </div>
      </div>

      {/* CARD SELECTION */}
      <div className={`${style.container}`}>
        {Object.keys(cards).map((card_type) => (
          <div>
            <h4>{card_type}</h4>
            <div className={`${style.card_container}`}>
              {cards[card_type].map((card) => (
                <span onClick={() => selectCard(card)}>
                  <Card
                    number={card.number}
                    type={card.type}
                    disable={isCardSelected(card)}
                  ></Card>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
