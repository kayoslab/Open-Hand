import csv from "../../Input/card_deck.csv?raw";
import type { Card } from "../domain/card";
import { parseCardCsv } from "./parseCardCsv";

export const cardDeck: Card[] = parseCardCsv(csv);
