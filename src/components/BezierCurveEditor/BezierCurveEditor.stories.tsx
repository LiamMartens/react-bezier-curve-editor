import type { Meta, StoryObj } from "@storybook/react";

import { BezierCurveEditor } from "./BezierCurveEditor";
import React, { useState } from "react";
import type { ExpandedValueType, ValueType } from "../../types";

const meta: Meta<typeof BezierCurveEditor> = {
  title: "BezierCurveEditor",
  component: BezierCurveEditor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof BezierCurveEditor>;

export const Example: Story = {
  args: {
    size: 300,
  },
};

export const Functional: Story = {
  args: {
    size: 300,
  },
  render(args) {
    const [value, setValue] = useState<ValueType>([0, 0, 1, 1]);
    return <BezierCurveEditor {...args} allowNodeEditing={false} value={value} onChange={setValue} />;
  },
};

export const EditableEndNodes: Story = {
  args: {
    size: 300,
  },
  render(args) {
    const [value, setValue] = useState<ExpandedValueType>([0.1, 0.5, 0.25, 0.5, 0.75, 0.9]);
    return <BezierCurveEditor {...args} value={value} onChange={setValue} allowNodeEditing/>;
  },
};
