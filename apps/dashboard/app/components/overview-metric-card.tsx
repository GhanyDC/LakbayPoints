import type { DashboardMetricViewModel } from "../../lib/dashboard-overview";

type OverviewMetricCardProps = {
  metric: DashboardMetricViewModel;
};

export function OverviewMetricCard({ metric }: OverviewMetricCardProps) {
  const headingId = `metric-${metric.id}`;

  return (
    <li
      aria-labelledby={headingId}
      className={`metric-card metric-card--${metric.tone}`}
    >
      <p className="metric-card__status">{metric.statusLabel}</p>
      <h3 className="metric-card__label" id={headingId}>
        {metric.label}
      </h3>
      <div className="metric-card__value-row">
        <p className="metric-card__value">{metric.displayValue}</p>
        {metric.unit ? (
          <span className="metric-card__unit">{metric.unit}</span>
        ) : null}
      </div>
      <p className="metric-card__support">{metric.supportingText}</p>
      <p className="metric-card__definition">{metric.definition}</p>
    </li>
  );
}
