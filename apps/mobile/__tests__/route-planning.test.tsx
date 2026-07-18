import { fireEvent, render } from "@testing-library/react-native";
import {
  formatRouteDistance,
  formatRouteFare,
  formatRouteTime,
  phase0APilotRoute,
} from "@lakbaypoints/shared";

import App from "../App";
import { PlanTripScreen } from "../NewScreens";

describe("Phase 0A route planning", () => {
  it("renders the Plan Trip journey from shared route data", () => {
    const view = render(
      <PlanTripScreen route={phase0APilotRoute} onCompareRoutes={jest.fn()} />,
    );

    expect(view.getAllByText(formatRouteTime(phase0APilotRoute))).toHaveLength(
      2,
    );
    expect(view.getByText(formatRouteDistance(phase0APilotRoute))).toBeTruthy();
    expect(view.getByText(formatRouteFare(phase0APilotRoute))).toBeTruthy();
    expect(view.getByText("Pending pilot calibration")).toBeTruthy();
    expect(view.getByText("Static prototype data")).toBeTruthy();

    for (const segment of phase0APilotRoute.segments) {
      expect(view.getByText(segment.label)).toBeTruthy();
    }

    expect(view.getByText(/Fare: To be confirmed/)).toBeTruthy();
    expect(view.queryByText(/heatmap/i)).toBeNull();
    expect(view.queryByText(/commuter density/i)).toBeNull();
    expect(view.queryByText(/crowd/i)).toBeNull();
    expect(view.queryByText(/route safety/i)).toBeNull();
  });

  it("opens Route Comparison from the Plan Trip CTA", () => {
    const view = render(<App />);

    fireEvent.press(view.getByText("Compare Route Options"));

    expect(view.getByText("Private Vehicle Baseline")).toBeTruthy();
    expect(view.getByText("Recommended Multimodal Pilot Route")).toBeTruthy();
    expect(view.getByText("Phase 2 Multimodal Future Preview")).toBeTruthy();
  });
});
