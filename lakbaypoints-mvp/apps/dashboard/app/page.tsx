import styles from "./page.module.css";

const starterItems = [
  {
    label: "MVP Corridor",
    text: "EDSA-MRT3 Guadalupe to Cubao",
  },
  {
    label: "Dashboard Scope",
    text: "Static foundation, no live API",
  },
  {
    label: "Next Build Step",
    text: "Route data and comparison screen",
  },
];

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>MMDA Dashboard</p>
          <h1 className={styles.title}>
            LakbayPoints verified mode-shift dashboard foundation
          </h1>
          <p className={styles.subtitle}>
            Starter page for the competition MVP. This app is ready for static
            route data, corridor reports, and demo metrics in later tasks.
          </p>
        </header>

        <div className={styles.statusGrid}>
          {starterItems.map((item) => (
            <article className={styles.statusCard} key={item.label}>
              <p className={styles.statusLabel}>{item.label}</p>
              <p className={styles.statusText}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
