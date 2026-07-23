type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  productMessage: string;
  routeContext: string;
  seedVersion: string;
  reviewedDate: string;
};

export function DashboardHeader({
  title,
  subtitle,
  productMessage,
  routeContext,
  seedVersion,
  reviewedDate,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="dashboard-header__eyebrow">Agency prototype overview</p>
        <h1>{title}</h1>
        <p className="dashboard-header__subtitle">{subtitle}</p>
        <p className="dashboard-header__message">{productMessage}</p>
      </div>

      <section
        aria-labelledby="route-context-heading"
        className="route-context"
      >
        <p className="route-context__eyebrow" id="route-context-heading">
          Final pilot route context
        </p>
        <p className="route-context__chain">{routeContext}</p>
        <dl className="route-context__metadata">
          <div>
            <dt>Seed version</dt>
            <dd>{seedVersion}</dd>
          </div>
          <div>
            <dt>Reviewed</dt>
            <dd>{reviewedDate}</dd>
          </div>
        </dl>
      </section>
    </header>
  );
}
