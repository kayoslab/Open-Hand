import type { Tier } from '../../domain/card';
import styles from './TierFilter.module.css';

const TIERS: Tier[] = ['Open', 'Working', 'Deep'];

interface TierFilterProps {
  activeTiers: Set<Tier>;
  onToggle: (tier: Tier) => void;
  onClear: () => void;
}

export function TierFilter({ activeTiers, onToggle, onClear }: TierFilterProps) {
  return (
    <div className={styles.tierFilter}>
      {TIERS.map((tier) => (
        <button
          key={tier}
          className={`${styles.tierButton} ${styles[tier.toLowerCase()]}`}
          aria-pressed={activeTiers.has(tier)}
          onClick={() => onToggle(tier)}
        >
          <span className={styles.indicator} />
          {tier}
        </button>
      ))}
      {activeTiers.size > 0 && (
        <button className={styles.clearButton} onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
}
