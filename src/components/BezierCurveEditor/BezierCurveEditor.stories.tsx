import type { Meta, StoryObj } from "@storybook/react";

import { BezierCurveEditor } from "./BezierCurveEditor";

const meta: Meta<typeof BezierCurveEditor> = {
  title: "BezierCurveEditor",
  component: BezierCurveEditor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof BezierCurveEditor>;

export const Example: Story = {
  args: {
    size: 300,
  },
};
