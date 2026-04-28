import styles from './ForTeams.module.css';

export function ForTeams() {
  return (
    <article className={styles.page}>
      <h1 className={styles.title}>For Teams</h1>
      <p>
        Open Hand works wherever conversations matter. Use it in leadership
        coaching, team retrospectives, skip-levels, and mentoring sessions.
      </p>

      <h2>Leadership and Management</h2>
      <p>
        Help managers move from status updates to real conversation. The deck
        gives structure without a script, surfacing topics neither party would
        have chosen on their own.
      </p>

      <h2>Team Retrospectives</h2>
      <p>
        Pre-define five slots — Check-in, Surface, Discuss, Decide, Close —
        and draw or curate one card per slot. Guarantees a coherent arc for
        skip-levels and team retros.
      </p>

      <h2>Coaching and Mentoring</h2>
      <p>
        The tier system lets facilitators calibrate depth. Start with Open
        cards for new relationships, move into Working territory as trust
        builds, and reach for Deep cards when the moment is right.
      </p>
    </article>
  );
}
