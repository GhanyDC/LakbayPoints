import { phase0APilotRoute, phase0BDashboardSeed } from "@lakbaypoints/shared";

import { DashboardHeader } from "./components/dashboard-header";
import { DashboardShell } from "./components/dashboard-shell";
import { MethodLimitations } from "./components/method-limitations";
import { PrototypeDisclosure } from "./components/prototype-disclosure";

const productMessage = "Guide the Trip. Verify the Shift. Improve Access.";
const routeContext = phase0APilotRoute.accessPoints
  .map((accessPoint) => accessPoint.label)
  .join(" → ");

export default function DashboardPage() {
  return (
    <DashboardShell>
      <PrototypeDisclosure
        statement={phase0BDashboardSeed.metadata.disclosure.statement}
      />
      <DashboardHeader
        productMessage={productMessage}
        reviewedDate={phase0BDashboardSeed.metadata.reviewedDate}
        routeContext={routeContext}
        seedVersion={phase0BDashboardSeed.metadata.seedVersion}
        subtitle={phase0BDashboardSeed.metadata.subtitle}
        title={phase0BDashboardSeed.metadata.title}
      />
      <MethodLimitations />
    </DashboardShell>
  );
}
