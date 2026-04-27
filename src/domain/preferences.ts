import type { Tier } from './card';

const VALID_TIERS: readonly string[] = ['Open', 'Working', 'Deep'];
const VALID_ROUTES: readonly string[] = ['/', '/browse', '/play', '/play/draw-three', '/guide'];

export function validateRoute(val: unknown): val is string {
  return typeof val === 'string' && VALID_ROUTES.includes(val);
}

export function validateTierArray(val: unknown): val is Tier[] {
  if (!Array.isArray(val)) return false;
  return val.every((item) => typeof item === 'string' && VALID_TIERS.includes(item));
}

function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export function validateSearchQuery(val: unknown): val is string {
  return isString(val);
}

export function validatePreferences(val: unknown): boolean {
  if (val === null || val === undefined || typeof val !== 'object') return false;
  const obj = val as Record<string, unknown>;
  if (!('lastRoute' in obj) || !('activeTiers' in obj) || !('searchQuery' in obj)) return false;
  if (!isString(obj.lastRoute)) return false;
  if (!validateTierArray(obj.activeTiers)) return false;
  if (!isString(obj.searchQuery)) return false;
  return true;
}
