import { fireEvent, render } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";

describe("mobile test harness", () => {
  it("renders a native component and handles a press", async () => {
    const onTabSelect = jest.fn();

    const view = await render(
      <Pressable onPress={() => onTabSelect("report")}>
        <Text>Report</Text>
      </Pressable>,
    );
    fireEvent.press(view.getByText("Report"));

    expect(onTabSelect).toHaveBeenCalledWith("report");
  });
});
