import { CardType } from "enum/CardType";
import React from "react";
import style from "./Card.module.scss";

export interface CardProps {
  number: any;
  type: CardType;
  disable?: boolean;
  fontSize?: number;
}

const Card: React.FC<CardProps> = ({
  number,
  type,
  disable = false,
  fontSize = 25,
}) => {
  let symbolType;
  let color = "";
  let value;
  let disabledClass = disable ? style.disabled : "";

  switch (number) {
    case 11:
      value = "J";
      break;
    case 12:
      value = "Q";
      break;
    case 13:
      value = "K";
      break;
    case 1:
      value = "A";
      break;
    default:
      value = String(number);
  }

  switch (type) {
    case CardType.CLUBS:
      symbolType = "♣";
      break;
    case CardType.DIAMONDS:
      symbolType = "♦";
      color = style.red;
      break;
    case CardType.HEARTS:
      symbolType = "♥";
      color = style.red;
      break;
    case CardType.SPADES:
      symbolType = "♠";
      break;
  }
  return (
    <span
      className={`${style.card} ${color} ${disabledClass}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <span className={style.top_type}>{symbolType}</span>
      <span className={style.number}>{value}</span>
      <span className={style.bottom_type}>{symbolType}</span>
    </span>
  );
};

export default Card;
