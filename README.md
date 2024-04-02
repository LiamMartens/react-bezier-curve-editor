# React Bezier Curve Editor

Customizable React Bezier Curve editor for easings and more. Default styling inspired by [cubic-bezier](https://cubic-bezier.com)

## Usage

```jsx
import { BezierCurveEditor } from 'react-bezier-curve-editor`;

<BezierCurveEditor />
```

## Props

| Name                         | Description                                                                                                 | Default value |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------- |
| `size`                       | This defines the width and the height of the control.                                                       | `200`         |
|                              | The final width/height of the component will be slightly larger because of the `outerAreaSize` and spacings |               |
| `outerAreaSize`              | The extra height above and below the editor. This is necessary for creating elastic curves                  | `50`          |
| `outerAreaColor`             | The background color of the outer area                                                                      | `#fafafa`     |
| `innerAreaColor`             | The background color of the actual editor area                                                              | `#ffffff`     |
| `rowColor`                   | The background color of the rows in the editor area                                                         | `#f2f2f2`     |
| `strokeWidth`                | The width of the bezier curve stroke                                                                        | `2`           |
| `curveLineColor`             | The stroke color of the bezier curve                                                                        | `#000`        |
| `fixedHandleColor`           | The background color of the curve fixed curve handle colors (start and end point)                           | `#fff`        |
| `handleLineColor`            | The stroke color of the handle lines. This also affects the stroke of the fixed handles                     | `#969696`     |
| `startHandleColor`           | The color of the start point curve handle                                                                   | `#f08`        |
| `endHandleColor`             | The color of the end point curve handle                                                                     | `#0ab`        |
| `startHandleClassName`       | The className of the start handle                                                                           |               |
| `startHandleActiveClassName` | Class to apply for active state of start handle                                                             |               |
| `endHandleClassName`         | The className of the end handle                                                                             |               |
| `endHandleActiveClassName`   | Class to apply for active state of end handle                                                               |               |
| `fixedPointActiveClassName`   | Class to apply for active state of fixed points                                                               |               |
| `value`                      | The current bezier curve value                                                                              | `[.4,0,1,.6]` |
| `onChange`                   | The onChange handler (takes bezier curve value array as parameter)                                          |               |
|`allowNodeEditing` | Whether or not the left and right nodes can be moved by the user | `false` | 

## Theming

Theming can be done by either overriding the class names or the CSS variables. Below is a list of the CSS variables used:

```css
:root {
  --bce-sizes-curve-handle: 16px;
  --bce-padding-sm: 4px;
  --bce-padding-md: 8px;
  --bce-padding-lg: 12px;
  --bce-padding-xl: 16px;
  --bce-colors-handle-line: #969696;
  --bce-colors-curve-line: black;
  --bce-colors-row: #f2f2f2;
  --bce-colors-background: white;
  --bce-colors-outerarea: #fafafa;
  --bce-colors-axisline: black;
  --bce-colors-handle-fixed: white;
  --bce-colors-handle-start: #f08;
  --bce-colors-handle-end: #0ab;
  --bce-colors-preview: white;
  --bce-colors-preview-border: black;
  --bce-colors-handle-active-shadow: rgba(255, 255, 255, 0.7);
}
```
