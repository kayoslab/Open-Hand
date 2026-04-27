import Papa from "papaparse";
import type { Card, Category, Tier } from "../domain/card";

const VALID_TIERS: readonly string[] = ["Open", "Working", "Deep"] as const;
const VALID_CATEGORIES: readonly string[] = [
  "Infrastructure",
  "Working Together",
  "Growth and Direction",
  "Feedback and Repair",
] as const;

interface CsvRow {
  CardNumber: string;
  Category: string;
  Tier: string;
  Prompt: string;
  Guidance: string;
  FlavourText: string;
  PairsWith: string;
}

function parseRow(row: CsvRow, index: number): Card {
  const rowNum = index + 1;

  const cardNumberRaw = row.CardNumber?.trim();
  if (!cardNumberRaw || isNaN(Number(cardNumberRaw))) {
    throw new Error(
      `Row ${rowNum}: CardNumber must be a valid number, got "${cardNumberRaw ?? ""}"`,
    );
  }
  const cardNumber = Number(cardNumberRaw);
  if (!Number.isInteger(cardNumber) || cardNumber < 1) {
    throw new Error(
      `Row ${rowNum}: CardNumber must be a positive integer, got "${cardNumberRaw}"`,
    );
  }

  const category = row.Category?.trim();
  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error(
      `Row ${rowNum}: Invalid Category "${category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`,
    );
  }

  const tier = row.Tier?.trim();
  if (!VALID_TIERS.includes(tier)) {
    throw new Error(
      `Row ${rowNum}: Invalid Tier "${tier}". Must be one of: ${VALID_TIERS.join(", ")}`,
    );
  }

  const prompt = row.Prompt?.trim();
  if (!prompt) {
    throw new Error(`Row ${rowNum}: Prompt must not be empty`);
  }

  const guidance = row.Guidance?.trim();
  if (!guidance) {
    throw new Error(`Row ${rowNum}: Guidance must not be empty`);
  }

  const flavourText = row.FlavourText?.trim() ?? "";

  const pairsWithRaw = row.PairsWith?.trim();
  let pairsWith: number | undefined;
  if (pairsWithRaw) {
    const parsed = Number(pairsWithRaw);
    if (isNaN(parsed) || !Number.isInteger(parsed) || parsed < 1) {
      throw new Error(
        `Row ${rowNum}: PairsWith must be a positive integer if provided, got "${pairsWithRaw}"`,
      );
    }
    pairsWith = parsed;
  }

  return {
    cardNumber,
    category: category as Category,
    tier: tier as Tier,
    prompt,
    guidance,
    flavourText,
    pairsWith,
  };
}

export function parseCardCsv(csvString: string): Card[] {
  const result = Papa.parse<CsvRow>(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    const first = result.errors[0];
    throw new Error(`CSV parse error at row ${first.row}: ${first.message}`);
  }

  return result.data.map((row, index) => parseRow(row, index));
}
