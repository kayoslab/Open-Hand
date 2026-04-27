export type Tier = "Open" | "Working" | "Deep";

export type Category =
  | "Infrastructure"
  | "Working Together"
  | "Growth and Direction"
  | "Feedback and Repair";

export interface Card {
  cardNumber: number;
  category: Category;
  tier: Tier;
  prompt: string;
  guidance: string;
  flavourText: string;
  pairsWith?: number;
}
