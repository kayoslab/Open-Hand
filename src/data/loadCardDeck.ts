import csv from "../../Input/card_deck.csv?raw";
import type { Card } from "../domain/card";
import { normalizeCardDeck } from "./normalizeCardDeck";
import { parseCardCsv } from "./parseCardCsv";
import { validateCardDeck } from "./validateCardDeck";

export const cardDeck: Card[] = normalizeCardDeck(validateCardDeck(parseCardCsv(csv)));
