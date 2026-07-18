import { act, fireEvent, render } from "@testing-library/react-native";
import { BackHandler } from "react-native";

import App from "../App";
import { RewardsOverviewScreen } from "../NewScreens";

function expectSelectedTab(view: ReturnType<typeof render>, tabLabel: string) {
  expect(
    view.getByLabelText(`${tabLabel} tab`).props.accessibilityState,
  ).toEqual({ selected: true });
}

describe("Phase 0A navigation and Rewards overview", () => {
  it("maps every bottom tab to its named destination and selected state", () => {
    const view = render(<App />);

    expect(view.getByText("Plan Your Trip")).toBeTruthy();
    expectSelectedTab(view, "Trips");

    fireEvent.press(view.getByLabelText("Home tab"));
    expect(view.getByText("Welcome to LakbayPoints")).toBeTruthy();
    expectSelectedTab(view, "Home");

    fireEvent.press(view.getByLabelText("Trips tab"));
    expect(view.getByText("Plan Your Trip")).toBeTruthy();
    expectSelectedTab(view, "Trips");

    fireEvent.press(view.getByLabelText("Rewards tab"));
    expect(view.getByText("Rewards Overview")).toBeTruthy();
    expect(
      view.getByText("No verified trip selected in this session"),
    ).toBeTruthy();
    expectSelectedTab(view, "Rewards");

    fireEvent.press(view.getByLabelText("Report tab"));
    expect(view.getByText("Submit Report")).toBeTruthy();
    expectSelectedTab(view, "Report");

    fireEvent.press(view.getByLabelText("Profile tab"));
    expect(view.getByText("Profile Preview")).toBeTruthy();
    expectSelectedTab(view, "Profile");
  });

  it("keeps unsupported gamification and redemption content out of Rewards", () => {
    const view = render(<RewardsOverviewScreen onPlanTrip={jest.fn()} />);

    expect(view.getByText("240")).toBeTruthy();
    expect(view.getByText("20 / 100")).toBeTruthy();
    expect(view.getByText("Verified trip history")).toBeTruthy();
    expect(view.getByText("Recommended Multimodal Pilot Route")).toBeTruthy();
    expect(view.getByText(/Subject to full trip verification/)).toBeTruthy();

    for (const unsupportedLabel of [
      /\bXP\b/i,
      /\blevel\b/i,
      /streak/i,
      /Redeem Rewards/i,
      /Transit Credits/i,
      /QR Ticket/i,
      /Merchant Discount/i,
      /Raffle Entry/i,
    ]) {
      expect(view.queryByText(unsupportedLabel)).toBeNull();
    }
  });

  it("returns to a verification-gated reward result through the Rewards tab", () => {
    const view = render(<App />);

    fireEvent.press(view.getByText("Compare Route Options"));
    fireEvent.press(view.getByText("Start Trip"));
    fireEvent.press(view.getByText("Begin Trip Playback"));
    fireEvent.press(view.getByText("Complete Trip & Verify"));
    fireEvent.press(view.getByText("View Rewards"));

    expect(view.getAllByText("Reward the Shift").length).toBeGreaterThan(0);
    expectSelectedTab(view, "Rewards");

    fireEvent.press(view.getByLabelText("Trips tab"));
    expect(view.getByText("Plan Your Trip")).toBeTruthy();
    fireEvent.press(view.getByLabelText("Rewards tab"));

    expect(view.getAllByText("Reward the Shift").length).toBeGreaterThan(0);
    expectSelectedTab(view, "Rewards");
  });

  it("handles Android back from comparison using the explicit back policy", () => {
    let hardwareBackHandler: (() => boolean | null | undefined) | undefined;
    const remove = jest.fn();
    const listener = jest
      .spyOn(BackHandler, "addEventListener")
      .mockImplementation((_event, handler) => {
        hardwareBackHandler = handler;
        return { remove };
      });
    const view = render(<App />);

    fireEvent.press(view.getByText("Compare Route Options"));
    expect(view.getByText("Private Vehicle Baseline")).toBeTruthy();

    act(() => {
      expect(hardwareBackHandler?.()).toBe(true);
    });

    expect(view.getByText("Plan Your Trip")).toBeTruthy();
    expectSelectedTab(view, "Trips");

    view.unmount();
    expect(remove).toHaveBeenCalled();
    listener.mockRestore();
  });
});
