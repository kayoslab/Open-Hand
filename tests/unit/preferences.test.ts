import { describe, it, expect, beforeEach } from 'vitest';

// Import will work once the module is created
let validatePreferences: (val: unknown) => boolean;
let validateRoute: (val: unknown) => val is string;
let validateTierArray: (val: unknown) => val is string[];

beforeEach(async () => {
  const mod = await import('../../src/domain/preferences');
  validatePreferences = mod.validatePreferences;
  validateRoute = mod.validateRoute;
  validateTierArray = mod.validateTierArray;
});

describe('preferences validation', () => {
  describe('validatePreferences', () => {
    it('accepts valid preferences object', () => {
      const valid = {
        lastRoute: '/browse',
        activeTiers: ['Open', 'Deep'],
        searchQuery: 'feedback',
      };
      expect(validatePreferences(valid)).toBe(true);
    });

    it('accepts preferences with empty activeTiers array', () => {
      const valid = {
        lastRoute: '/',
        activeTiers: [],
        searchQuery: '',
      };
      expect(validatePreferences(valid)).toBe(true);
    });

    it('accepts preferences with all valid tiers', () => {
      const valid = {
        lastRoute: '/play',
        activeTiers: ['Open', 'Working', 'Deep'],
        searchQuery: '',
      };
      expect(validatePreferences(valid)).toBe(true);
    });

    it('rejects null', () => {
      expect(validatePreferences(null)).toBe(false);
    });

    it('rejects undefined', () => {
      expect(validatePreferences(undefined)).toBe(false);
    });

    it('rejects non-object values', () => {
      expect(validatePreferences('string')).toBe(false);
      expect(validatePreferences(42)).toBe(false);
      expect(validatePreferences(true)).toBe(false);
    });

    it('rejects object with missing lastRoute', () => {
      const invalid = {
        activeTiers: ['Open'],
        searchQuery: '',
      };
      expect(validatePreferences(invalid)).toBe(false);
    });

    it('rejects object with missing activeTiers', () => {
      const invalid = {
        lastRoute: '/browse',
        searchQuery: '',
      };
      expect(validatePreferences(invalid)).toBe(false);
    });

    it('rejects object with missing searchQuery', () => {
      const invalid = {
        lastRoute: '/browse',
        activeTiers: ['Open'],
      };
      expect(validatePreferences(invalid)).toBe(false);
    });

    it('rejects invalid tier values in activeTiers', () => {
      const invalid = {
        lastRoute: '/browse',
        activeTiers: ['Open', 'InvalidTier'],
        searchQuery: '',
      };
      expect(validatePreferences(invalid)).toBe(false);
    });

    it('rejects non-array activeTiers', () => {
      const invalid = {
        lastRoute: '/browse',
        activeTiers: 'Open',
        searchQuery: '',
      };
      expect(validatePreferences(invalid)).toBe(false);
    });

    it('rejects non-string searchQuery', () => {
      const invalid = {
        lastRoute: '/browse',
        activeTiers: ['Open'],
        searchQuery: 123,
      };
      expect(validatePreferences(invalid)).toBe(false);
    });

    it('rejects non-string lastRoute', () => {
      const invalid = {
        lastRoute: 42,
        activeTiers: ['Open'],
        searchQuery: '',
      };
      expect(validatePreferences(invalid)).toBe(false);
    });
  });

  describe('validateRoute', () => {
    it('accepts valid route "/"', () => {
      expect(validateRoute('/')).toBe(true);
    });

    it('accepts valid route "/browse"', () => {
      expect(validateRoute('/browse')).toBe(true);
    });

    it('accepts valid route "/play"', () => {
      expect(validateRoute('/play')).toBe(true);
    });

    it('accepts valid route "/play/draw-three"', () => {
      expect(validateRoute('/play/draw-three')).toBe(true);
    });

    it('accepts valid route "/guide"', () => {
      expect(validateRoute('/guide')).toBe(true);
    });

    it('rejects unknown routes', () => {
      expect(validateRoute('/unknown')).toBe(false);
      expect(validateRoute('/admin')).toBe(false);
      expect(validateRoute('/play/unknown')).toBe(false);
    });

    it('rejects non-string values', () => {
      expect(validateRoute(42)).toBe(false);
      expect(validateRoute(null)).toBe(false);
      expect(validateRoute(undefined)).toBe(false);
      expect(validateRoute({})).toBe(false);
    });

    it('rejects empty string', () => {
      expect(validateRoute('')).toBe(false);
    });
  });

  describe('validateTierArray', () => {
    it('accepts empty array', () => {
      expect(validateTierArray([])).toBe(true);
    });

    it('accepts array with valid tiers', () => {
      expect(validateTierArray(['Open'])).toBe(true);
      expect(validateTierArray(['Open', 'Working'])).toBe(true);
      expect(validateTierArray(['Open', 'Working', 'Deep'])).toBe(true);
    });

    it('rejects array with invalid tier values', () => {
      expect(validateTierArray(['Open', 'Invalid'])).toBe(false);
      expect(validateTierArray(['low', 'medium', 'high'])).toBe(false);
    });

    it('rejects non-array values', () => {
      expect(validateTierArray('Open')).toBe(false);
      expect(validateTierArray(null)).toBe(false);
      expect(validateTierArray(42)).toBe(false);
      expect(validateTierArray({})).toBe(false);
    });

    it('rejects array with non-string elements', () => {
      expect(validateTierArray([1, 2, 3])).toBe(false);
      expect(validateTierArray([null])).toBe(false);
    });
  });
});
