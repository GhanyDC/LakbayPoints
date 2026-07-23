import { fireEvent, render } from "@testing-library/react-native";

import App from "../App";

function openPlayback(view: ReturnType<typeof render>) {
  fireEvent.press(view.getByText("Compare Route Options"));
  fireEvent.press(view.getByText("Start Trip"));
  fireEvent.press(view.getByText("Begin Trip Playback"));
}

function advanceToFinalSegment(view: ReturnType<typeof render>) {
  for (let segment = 1; segment < 5; segment += 1) {
    fireEvent.press(view.getByText("Continue Playback"));
  }
}

describe("deterministic Phase 0A playback", () => {
  it("starts on visual segment 1 / internal index 0 and blocks verification", () => {
    const view = render(<App />);
    openPlayback(view);

    expect(view.getAllByText("Jeepney access to MRT-3")).toHaveLength(2);
    expect(view.getByText("Continue Playback")).toBeTruthy();
    expect(view.queryByText("Complete Trip & Verify")).toBeNull();
    expect(
      view.getByRole("button", { name: "Test suspicious trace" }).props
        .accessibilityState,
    ).toEqual({ disabled: true });
    expect(view.queryByText("View Rewards")).toBeNull();
  });

  it("progresses through all five route segments in order", () => {
    const view = render(<App />);
    openPlayback(view);

    for (const currentSegment of [
      "MRT-3 to Guadalupe",
      "Walk to Guadalupe Ferry Station",
      "Pasig River Ferry to Hulo",
      "Walk to Hulo Office Demo Destination",
    ]) {
      fireEvent.press(view.getByText("Continue Playback"));
      expect(view.getAllByText(currentSegment)).toHaveLength(2);
    }

    expect(view.queryByText("Continue Playback")).toBeNull();
    expect(view.getByText("Complete Trip & Verify")).toBeTruthy();
    expect(
      view.getByRole("button", { name: "Test suspicious trace" }).props
        .accessibilityState,
    ).toEqual({ disabled: false });
  });

  it("verifies the valid generated trace only after completion", () => {
    const view = render(<App />);
    openPlayback(view);
    advanceToFinalSegment(view);

    fireEvent.press(view.getByText("Complete Trip & Verify"));

    expect(
      view.getByText("Result: Verified sustainable trip chain"),
    ).toBeTruthy();
    expect(view.getByText("Reward Eligibility: Full")).toBeTruthy();
    expect(view.getByText("Restart Playback")).toBeTruthy();
  });

  it("keeps the suspicious generated trace choice available", () => {
    const view = render(<App />);
    openPlayback(view);
    advanceToFinalSegment(view);

    fireEvent.press(view.getByText("Test suspicious trace"));

    expect(view.getByText("Result: Suspicious pattern")).toBeTruthy();
    expect(view.getByText("Reward Eligibility: None")).toBeTruthy();
  });

  it("restarts at segment 1 and clears the verification result", () => {
    const view = render(<App />);
    openPlayback(view);
    advanceToFinalSegment(view);
    fireEvent.press(view.getByText("Complete Trip & Verify"));

    fireEvent.press(view.getByText("Restart Playback"));

    expect(view.getAllByText("Jeepney access to MRT-3")).toHaveLength(2);
    expect(view.getByText("Continue Playback")).toBeTruthy();
    expect(
      view.queryByText("Result: Verified sustainable trip chain"),
    ).toBeNull();
    expect(view.queryByText("View Rewards")).toBeNull();
  });
});

describe("final-route report locations", () => {
  it("offers all five final-route access areas", () => {
    const view = render(<App />);
    fireEvent.press(view.getByLabelText("Report tab"));

    for (const location of [
      "MRT-3 Araneta-Cubao access area",
      "MRT-3 Guadalupe access area",
      "Guadalupe Ferry access area",
      "Hulo Ferry access area",
      "Hulo office last-mile access area",
    ]) {
      expect(view.getByText(location)).toBeTruthy();
    }
    expect(view.queryByText("Shaw Boulevard access area")).toBeNull();
    expect(view.queryByText("Ortigas Station access area")).toBeNull();
  });

  it("uses the LakbayPoints prototype review-queue wording", () => {
    const view = render(<App />);
    fireEvent.press(view.getByLabelText("Report tab"));
    fireEvent.press(view.getByText("Sidewalk obstruction"));
    fireEvent.press(view.getByText("High"));
    fireEvent.press(view.getByText("Guadalupe Ferry access area"));
    fireEvent.changeText(
      view.getByPlaceholderText("Briefly describe the access barrier."),
      "Temporary access obstruction",
    );
    fireEvent.press(view.getByText("Submit Report"));

    expect(
      view.getByText(
        "Submitted to the LakbayPoints prototype review queue for demonstration.",
      ),
    ).toBeTruthy();
  });
});
