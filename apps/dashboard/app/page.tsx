import { DashboardHeader } from "./components/dashboard-header";
import { DashboardShell } from "./components/dashboard-shell";
import { MethodLimitations } from "./components/method-limitations";
import { OverviewGrid } from "./components/overview-grid";
import { PrototypeDisclosure } from "./components/prototype-disclosure";
import { dashboardOverviewViewModel } from "../lib/dashboard-overview";

export default function DashboardPage() {
  const viewModel = dashboardOverviewViewModel;

  return (
    <DashboardShell>
      <PrototypeDisclosure statement={viewModel.disclosure} />
      <DashboardHeader
        productMessage={viewModel.productMessage}
        reviewedDate={viewModel.reviewedDate}
        routeContext={viewModel.routeContext}
        seedVersion={viewModel.seedVersion}
        subtitle={viewModel.subtitle}
        title={viewModel.title}
      />
      <OverviewGrid metrics={viewModel.metrics} />
      <MethodLimitations />
    </DashboardShell>
  );
}
