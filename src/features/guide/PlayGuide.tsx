import { useLayoutEffect, useRef, useState } from 'react';
import styles from './PlayGuide.module.css';

export function PlayGuide() {
  const ref = useRef<HTMLElement>(null);
  const [insideMain, setInsideMain] = useState(false);

  useLayoutEffect(() => {
    if (ref.current?.closest('main')) {
      setInsideMain(true);
    }
  }, []);

  return (
    <article
      ref={ref}
      className={styles.guide}
      role={insideMain ? undefined : 'main'}
    >
      <h1 className={styles.title}>Play Guide</h1>
      <h2>Structure at a Glance</h2>
      <p>
        A short companion to the 57-card deck. Print double-sided on A6 if you
        want a physical copy.
      </p>
      <div className={styles.categoryList}>
        <p>
          <dfn className={styles.categoryName}>Infrastructure</dfn> (5 cards).
          Bookends and rules of play. Used every conversation.
        </p>
        <p>
          <dfn className={styles.categoryName}>Working Together</dfn> (18
          cards). How we collaborate, communicate, and run our time.
        </p>
        <p>
          <dfn className={styles.categoryName}>Growth and Direction</dfn> (16
          cards). Career, skills, identity, motivation.
        </p>
        <p>
          <dfn className={styles.categoryName}>Feedback and Repair</dfn> (18
          cards). Giving, receiving, recognition, conflict.
        </p>
      </div>

      <p>Every card has a tier indicator:</p>
      <ul className={styles.tierList}>
        <li>
          <span className={styles.tierOpen}>Open</span> (warm-up; ~12 cards).
          Low-stakes; suitable for first 1:1s, late afternoons, after holidays.
        </li>
        <li>
          <span className={styles.tierWorking}>Working</span> (~38 cards). The
          standard working deck. Most 1:1s live here.
        </li>
        <li>
          <span className={styles.tierDeep}>Deep</span> (~7 cards).
          Vulnerability-adjacent. Always permission-prefaced. Don't pull from
          this tier without consent.
        </li>
      </ul>

      <h2>Three Ways to Play</h2>

      <h3>For 1:1s — Draw Three, Keep One</h3>
      <ol>
        <li>
          Open the meeting with <strong>Card 1</strong> (the highlight
          question).
        </li>
        <li>
          Manager fans the deck (or just the relevant tier), draws three cards at
          random, and offers them face-up to the report.
        </li>
        <li>
          Report picks <strong>one</strong>. The other two go back. The point is
          to protect the report's agency and let randomness surface topics
          neither party would have chosen.
        </li>
        <li>
          After their answer, ask "And what else?" at least twice before moving
          on.
        </li>
        <li>
          Close with <strong>Card 2</strong> (the learning question).
        </li>
      </ol>
      <p>
        Allow about ten minutes per card if you honour the AWE follow-ups. Two
        cards is a healthy 1:1.
      </p>

      <h3>For Feedback Conversation — Joint Pull Plus Time-Box</h3>
      <ol>
        <li>
          Both participants draw two cards each from the{' '}
          <strong>Feedback and Repair</strong> pile.
        </li>
        <li>
          Share what you drew. Jointly choose <strong>one</strong> to anchor a
          20-minute conversation.
        </li>
        <li>
          Card 2 (closer) is always the second card and resets the clock.
        </li>
        <li>
          If a Deep card surfaces, draw <strong>Card 3</strong> (permission)
          first.
        </li>
      </ol>
      <p>
        The giver does not pre-select; the receiver does not unilaterally veto.
        Time-boxing is the discipline that prevents drift.
      </p>

      <h3>For Team-Level Use (Occasional) — Slot Fill</h3>
      <p>
        Pre-define five slots: Check-in / Surface / Discuss / Decide / Close.
        Draw or curate one card per slot. Borrowed from Retromat. Guarantees a
        coherent arc. Overkill for 1:1s; works well for skip-levels and team
        retros.
      </p>

      <h2>Rituals</h2>
      <ul>
        <li>
          <strong>Permission is a deck rule, not a card type.</strong> Every Deep
          card carries an implied prefix:{' '}
          <em>"If you're up for it — pass is fine."</em> Say it out loud if
          needed.
        </li>
        <li>
          <strong>The closer is the same every time.</strong> Always end with
          Card 2. The conversation does not end without it.
        </li>
        <li>
          <strong>Save Token.</strong> Three wooden discs come with the box.
          Either party can place a token on a drawn card to defer it to the next
          1:1. This is the deck's pressure-release valve and the single mechanic
          that most increases the chance of vulnerable cards getting actually
          used.
        </li>
        <li>
          <strong>Etiquette card</strong> (Card 4). Read it once at the start of
          a new pairing. Three rules: silence is allowed; "And what else?"
          follows every answer; any card can be passed without explanation.
        </li>
      </ul>

      <h2>Pairing References</h2>
      <p>
        Some cards have a <code>PairsWith</code> value — a card number that
        pairs naturally if the conversation has more time. This makes the deck a
        graph, not a stack, and rewards repeat use. Optional. Ignore if it gets
        in the way.
      </p>

      <h2>Flavour Text</h2>
      <p>
        Bottom of every card. <em>Italics if you can.</em> Pure observation, no
        advice. Read it or don't — it's not the question. It exists to take the
        edge off and make the deck feel like a deck, not a worksheet.
      </p>
    </article>
  );
}
