import type { DashboardMetricViewModel } from "../../lib/dashboard-overview";

import { OverviewMetricCard } from "./overview-metric-card";

type OverviewGridProps = {
  metrics: DashboardMetricViewModel[];
};

export function OverviewGrid({ metrics }: OverviewGridProps) {
  return (
    <section
      aria-labelledby="pilot-overview-heading"
      className="overview-section"
    >
      <div className="overview-section__header">
        <div>
          <p className="overview-section__eyebrow">Deterministic pilot view</p>
          <h2 id="pilot-overview-heading">Pilot overview</h2>
        </div>
        <p className="overview-section__intro">
          Six presentation metrics derived from the canonical Phase 0B seed and
          shared aggregation rules.
        </p>
      </div>

      <ol aria-label="Phase 0B overview metrics" className="overview-grid">
        {metrics.map((metric) => (
          <OverviewMetricCard key={metric.id} metric={metric} />
        ))}
      </ol>
    </section>
  );
}
