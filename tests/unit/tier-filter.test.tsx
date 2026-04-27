import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Tier } from '../../src/domain/card';

/**
 * US-012: TierFilter component tests
 *
 * Tests for the TierFilter UI component that renders toggle buttons
 * for Open, Working, and Deep tiers, plus a clear filters action.
 */

async function loadTierFilter() {
  const mod = await import('../../src/ui/TierFilter/TierFilter');
  return mod.TierFilter;
}

describe('US-012: TierFilter component', () => {
  describe('rendering', () => {
    it('renders three tier toggle buttons', async () => {
      const TierFilter = await loadTierFilter();
      render(
        <TierFilter activeTiers={new Set()} onToggle={() => {}} onClear={() => {}} />
      );

      expect(screen.getByRole('button', { name: /open/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /working/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /deep/i })).toBeDefined();
    });

    it('renders text labels on each button (colour is not the sole indicator)', async () => {
      const TierFilter = await loadTierFilter();
      render(
        <TierFilter activeTiers={new Set()} onToggle={() => {}} onClear={() => {}} />
      );

      expect(screen.getByText('Open')).toBeDefined();
      expect(screen.getByText('Working')).toBeDefined();
      expect(screen.getByText('Deep')).toBeDefined();
    });
  });

  describe('toggle interaction', () => {
    it('calls onToggle with "Open" when Open button is clicked', async () => {
      const TierFilter = await loadTierFilter();
      const onToggle = vi.fn();
      render(
        <TierFilter activeTiers={new Set()} onToggle={onToggle} onClear={() => {}} />
      );

      fireEvent.click(screen.getByRole('button', { name: /open/i }));
      expect(onToggle).toHaveBeenCalledWith('Open');
    });

    it('calls onToggle with "Working" when Working button is clicked', async () => {
      const TierFilter = await loadTierFilter();
      const onToggle = vi.fn();
      render(
        <TierFilter activeTiers={new Set()} onToggle={onToggle} onClear={() => {}} />
      );

      fireEvent.click(screen.getByRole('button', { name: /working/i }));
      expect(onToggle).toHaveBeenCalledWith('Working');
    });

    it('calls onToggle with "Deep" when Deep button is clicked', async () => {
      const TierFilter = await loadTierFilter();
      const onToggle = vi.fn();
      render(
        <TierFilter activeTiers={new Set()} onToggle={onToggle} onClear={() => {}} />
      );

      fireEvent.click(screen.getByRole('button', { name: /deep/i }));
      expect(onToggle).toHaveBeenCalledWith('Deep');
    });
  });

  describe('active tier indication', () => {
    it('visually indicates active tiers via aria-pressed', async () => {
      const TierFilter = await loadTierFilter();
      const activeTiers = new Set<Tier>(['Open', 'Deep']);
      render(
        <TierFilter activeTiers={activeTiers} onToggle={() => {}} onClear={() => {}} />
      );

      expect(screen.getByRole('button', { name: /open/i }).getAttribute('aria-pressed')).toBe('true');
      expect(screen.getByRole('button', { name: /working/i }).getAttribute('aria-pressed')).toBe('false');
      expect(screen.getByRole('button', { name: /deep/i }).getAttribute('aria-pressed')).toBe('true');
    });

    it('shows no tiers as active when activeTiers is empty', async () => {
      const TierFilter = await loadTierFilter();
      render(
        <TierFilter activeTiers={new Set()} onToggle={() => {}} onClear={() => {}} />
      );

      const buttons = screen.getAllByRole('button');
      const tierButtons = buttons.filter(
        (b) => b.getAttribute('aria-pressed') !== null
      );
      expect(tierButtons.every((b) => b.getAttribute('aria-pressed') === 'false')).toBe(true);
    });
  });

  describe('clear filters action', () => {
    it('shows clear button when at least one tier is active', async () => {
      const TierFilter = await loadTierFilter();
      render(
        <TierFilter
          activeTiers={new Set<Tier>(['Working'])}
          onToggle={() => {}}
          onClear={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /clear/i })).toBeDefined();
    });

    it('hides clear button when no tiers are active', async () => {
      const TierFilter = await loadTierFilter();
      render(
        <TierFilter activeTiers={new Set()} onToggle={() => {}} onClear={() => {}} />
      );

      expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
    });

    it('calls onClear when clear button is clicked', async () => {
      const TierFilter = await loadTierFilter();
      const onClear = vi.fn();
      render(
        <TierFilter
          activeTiers={new Set<Tier>(['Open'])}
          onToggle={() => {}}
          onClear={onClear}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /clear/i }));
      expect(onClear).toHaveBeenCalledOnce();
    });
  });

  describe('accessibility', () => {
    it('tier buttons are keyboard-focusable', async () => {
      const TierFilter = await loadTierFilter();
      render(
        <TierFilter activeTiers={new Set()} onToggle={() => {}} onClear={() => {}} />
      );

      const openBtn = screen.getByRole('button', { name: /open/i });
      const workingBtn = screen.getByRole('button', { name: /working/i });
      const deepBtn = screen.getByRole('button', { name: /deep/i });

      // Buttons are natively keyboard-focusable; verify they are not disabled
      expect(openBtn).not.toBeDisabled();
      expect(workingBtn).not.toBeDisabled();
      expect(deepBtn).not.toBeDisabled();
    });
  });
});
