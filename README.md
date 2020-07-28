# React Bezier Curve Editor
Customizable React Bezier Curve editor for easings. Default styling inspired by [cubic-bezier](https://cubic-bezier.com)
![demo](./img/demo.JPG)

## Usage
```
import { BezierCurveEditor } from 'react-bezier-curve-editor`;
<BezierCurveEditor
/>
```

## Props
|             Name             |                                                 Description                                                 | Default value |
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
| `value`                      | The current bezier curve value                                                                              | `[.4,0,1,.6]` |
| `onChange`                   | The onChange handler (takes bezier curve value array as parameter)                                          |               |