import type { Meta, StoryObj } from "@storybook/react";

import { BezierCurveEditor } from "./BezierCurveEditor";
import React, { useState } from "react";
import type { ExpandedValueType, ValueType } from "../../types";

const meta: Meta<typeof BezierCurveEditor> = {
  title: "BezierCurveEditor",
  component: BezierCurveEditor,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "At the most **[basic](#basic)**, the `BezierCurveEditor` works the same as those",
          "you would find in Chrome Developer Tools for easing functions - there",
          "are two fixed endpoints and two handles that can be positioned to edit the curve.",
          "A more **[advanced](#advanced)** usage would be to allow the user to edit the positions of both the handles _and_ the endpoints.",
        ].join(" "),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    size: 300,
  },
};

export default meta;
type Story = StoryObj<typeof BezierCurveEditor>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          `To use the component in the basic way, pass an array with four numbers between 0 and 1 inclusive to the \`value\` prop.`,
          `The same format will be passed to the change handler that you provide when the value changes.`,
          "\n\n_Note: If you are using TypeScript, you may need to set the `allowNodeEditing` prop to `false`_"
        ].join(" "),
      },
    },
  },
  render(args) {
    const [value, setValue] = useState<ValueType>([0.25, 0.5, 0.75, 0.5]);
    return <BezierCurveEditor {...args} allowNodeEditing={false} value={value} onChange={setValue} />;
  },
};

export const AdvancedBothAxes: Story = {
  name: "Advanced",
  parameters: {
    docs: {
      description: {
        story: [
          `To use the component in the advanced way, you must set the \`allowNodeEditing\` prop to \`true\`.`,
          `An array with 8 numbers between 0 and 1 inclusive will be used for the value and will be passed to your change handler.`,
          "\n\n_Note: By default, all of the values are editable. Scroll down to see examples that constrain axes._",
        ].join(" "),
      },
    },
  },
  render(args) {
    const [value, setValue] = useState<ExpandedValueType>([0, 0.1, 0.5, 0.25, 0.5, 0.75, 1, 0.9]);
    return <BezierCurveEditor {...args} value={value} onChange={setValue} allowNodeEditing />;
  },
};

export const AdvancedYAxis: Story = {
  name: "Advanced - Edit Y Axis Only",
  render(args) {
    const [value, setValue] = useState<ExpandedValueType>([0, 0.1, 0.5, 0.25, 0.5, 0.75, 1, 0.9]);

    const updateValue = React.useCallback((value: ExpandedValueType) => {
      setValue([0, ...value.slice(1, 6), 1, value[7]] as ExpandedValueType);
    }, []);

    return <BezierCurveEditor {...args} value={value} onChange={updateValue} allowNodeEditing />;
  },
};

export const AdvancedXAxis: Story = {
  name: "Advanced - Edit X Axis Only",
  render(args) {
    const [value, setValue] = useState<ExpandedValueType>([0.1, 0, 0.5, 0.25, 0.5, 0.75, 0.9, 1]);

    const updateValue = React.useCallback((value: ExpandedValueType) => {
      setValue([value[0], 0, ...value.slice(2, -1), 1] as ExpandedValueType);
    }, []);

    return <BezierCurveEditor {...args} value={value} onChange={updateValue} allowNodeEditing />;
  },
};
