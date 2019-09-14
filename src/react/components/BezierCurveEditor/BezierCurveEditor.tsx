import * as React from 'react';
import * as styles from './BezierCurveEditor.scss';
import classNames from 'classnames';

type ValueType = [number, number, number, number];

interface IProps {
    size?: number;
    outerAreaSize?: number;
    outerAreaColor?: string;
    innerAreaColor?: string;
    strokeWidth?: number;
    rowColor?: string;
    fixedHandleColor?: string;
    curveLineColor?: string;
    handleLineColor?: string;
    startHandleColor?: string;
    endHandleColor?: string;
    className?: string;
    startHandleClassName?: string;
    startHandleActiveClassName?: string;
    endHandleClassName?: string;
    endHandleActiveClassName?: string;
    value?: ValueType;
    onChange?: (value: ValueType) => void;
}

interface IState {
    value: ValueType;
    startValue: ValueType;
    movingStartHandle: boolean;
    movingStartHandleStart: { x: number; y: number; };
    movingEndHandle: boolean;
    movingEndHandleStart: { x: number; y: number; };
}

type PropsWithDefaults = IProps & typeof BezierCurveEditor.defaultProps;

export class BezierCurveEditor extends React.Component<IProps, IState> {
    public static defaultProps = {
        size: 200,
        outerAreaSize: 50,
        strokeWidth: 2,
    }

    public static getDerivedStateFromProps(nextProps: IProps, cursState: IState) {
        const { value } = nextProps;
        if (value !== undefined) {
            return {
                value,
            };
        }
        return null;
    }

    public state: IState = {
        value: [.4,0,1,.6], // easeIn
        startValue: [.4,0,1,.6],
        movingStartHandle: false,
        movingEndHandle: false,
        movingStartHandleStart: { x: 0, y: 0 },
        movingEndHandleStart: { x: 0, y: 0 },
    }

    //#region getters
    private get width() {
        const { size } = this.props as PropsWithDefaults;
        return size;
    }

    private get height() {
        return this.width;
    }

    private get startCoordinate() {
        return [0, this.height];
    }

    private get endCoordinate() {
        return [this.width,0];
    }

    private get startBezierHandle() {
        const { value } = this.state;
        return [this.width * value[0], this.height * (1 - value[1])];
    }

    private get endBezierHandle() {
        const { value } = this.state;
        return [this.width * value[2], this.height * (1 - value[3])];
    }
    //#endregion

    //#region helpers
    private stopMovingAll = () => {
        this.setState({
            movingStartHandle: false,
            movingEndHandle: false,
        });
    }

    private moveHandles = (x: number, y: number) => {
        const { onChange } = this.props;
        const { startValue, movingStartHandle, movingStartHandleStart, movingEndHandle, movingEndHandleStart } = this.state;
        const relevantStart = movingStartHandle ? movingStartHandleStart : (movingEndHandle ? movingEndHandleStart : undefined);

        if (movingStartHandle || movingEndHandle) {
            const relXMoved = (x - relevantStart.x) / this.width;
            const relYMoved = (y - relevantStart.y) / this.height;
            const nextValue = [...startValue] as ValueType;

            if (movingStartHandle) {
                nextValue[0] = nextValue[0] + relXMoved;
                nextValue[1] = nextValue[1] - relYMoved;
            }

            if (movingEndHandle) {
                nextValue[2] = nextValue[2] + relXMoved;
                nextValue[3] = nextValue[3] - relYMoved;
            }

            const clampedValue = this.clampValue(nextValue);
            if (onChange) onChange(clampedValue);
            this.setState({
                value: clampedValue,
            });
        }
    }

    private clampValue = (value: ValueType) => {
        const { outerAreaSize } = this.props as PropsWithDefaults;
        const allowedOuterValue = outerAreaSize / this.height;
        const nextValue = [...value] as ValueType;
        nextValue[0] = Math.max(0, Math.min(1, nextValue[0]));
        nextValue[2] = Math.max(0, Math.min(1, nextValue[2]));
        nextValue[1] = Math.max(-allowedOuterValue, Math.min(1 + allowedOuterValue, nextValue[1]));
        nextValue[3] = Math.max(-allowedOuterValue, Math.min(1 + allowedOuterValue, nextValue[3]));
        return nextValue;
    }
    //#endregion

    private handleStartHandleStartMoving = (event) => {
        const { value, movingStartHandle } = this.state;
        if (!movingStartHandle) {
            event.preventDefault();

            let startX = 0;
            let startY = 0;
            if (event.type === 'touchstart') {
                const e = event as TouchEvent;
                startX = e.touches[0].screenX;
                startY = e.touches[0].screenY;
            } else if (event.type === 'mousedown') {
                const e = event as MouseEvent;
                startX = e.screenX;
                startY = e.screenY;
            }

            this.setState({
                startValue: [...value] as ValueType,
                movingStartHandle: true,
                movingStartHandleStart: { x: startX, y: startY, },
            });
        }
    }

    private handleEndHandleStartMoving = (event) => {
        const { value, movingEndHandle } = this.state;
        if (!movingEndHandle) {
            event.preventDefault();

            let startX = 0;
            let startY = 0;
            if (event.type === 'touchstart') {
                const e = event as TouchEvent;
                startX = e.touches[0].screenX;
                startY = e.touches[0].screenY;
            } else if (event.type === 'mousedown') {
                const e = event as MouseEvent;
                startX = e.screenX;
                startY = e.screenY;
            }

            this.setState({
                startValue: [...value] as ValueType,
                movingEndHandle: true,
                movingEndHandleStart: { x: startX, y: startY, },
            });
        }
    }

    private handleWindowTouchMove = (event: TouchEvent) => {
        const { movingStartHandle, movingEndHandle } = this.state;
        if (movingStartHandle || movingEndHandle) {
            const x = event.touches[0].screenX;
            const y = event.touches[0].screenY;
            this.moveHandles(x, y);
        }
    }

    private handleWindowMouseMove = (event: MouseEvent) => {
        const { movingStartHandle, movingEndHandle } = this.state;
        if (movingStartHandle || movingEndHandle) {
            const x = event.screenX;
            const y = event.screenY;
            this.moveHandles(x, y);
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleWindowMouseMove);
        window.removeEventListener('touchmove', this.handleWindowTouchMove);

        window.removeEventListener('mouseup', this.stopMovingAll);
        window.removeEventListener('touchend', this.stopMovingAll);
        window.removeEventListener('mouseleave', this.stopMovingAll);
        window.removeEventListener('touchcancel', this.stopMovingAll);
    }

    public componentDidMount() {
        window.addEventListener('mousemove', this.handleWindowMouseMove);
        window.addEventListener('touchmove', this.handleWindowTouchMove);

        window.addEventListener('mouseup', this.stopMovingAll);
        window.addEventListener('touchend', this.stopMovingAll);
        window.addEventListener('mouseleave', this.stopMovingAll);
        window.addEventListener('touchcancel', this.stopMovingAll);
    }

    public render() {
        const {
            strokeWidth,
            rowColor,
            outerAreaColor,
            innerAreaColor,
            fixedHandleColor,
            curveLineColor,
            handleLineColor,
            outerAreaSize,
            startHandleColor,
            endHandleColor,
            className,
            startHandleClassName,
            startHandleActiveClassName,
            endHandleClassName,
            endHandleActiveClassName
        } = this.props as PropsWithDefaults;
        const { movingStartHandle, movingEndHandle } = this.state;

        const svgWidth = this.width + strokeWidth * 2;
        const svgHeight = this.height + strokeWidth * 2 + (outerAreaSize * 2);

        return (
            <div className={classNames({
                [styles.root]: true,
                [className]: !!className,
            })}>
                <div className={styles.wrap}>
                    <div
                        className={styles.bg}
                        style={{
                            left: `${strokeWidth}px`,
                            width: `${this.width - strokeWidth}px`,
                            backgroundColor: outerAreaColor,
                        }}
                    ></div>
                    <div
                        className={styles.plane}
                        style={{
                            top: `${outerAreaSize + strokeWidth}px`,
                            left: `${strokeWidth}px`,
                            width: `${this.width - strokeWidth}px`,
                            height: `${this.height}px`
                        }}
                    >
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100" height="101" fill={innerAreaColor || styles.colorBackground} />
                            <g fill={rowColor || styles.colorRow}>
                                <rect width="100" height="5"/>
                                <rect y="10" width="100" height="5"/>
                                <rect y="20" width="100" height="5"/>
                                <rect y="30" width="100" height="5"/>
                                <rect y="40" width="100" height="5"/>
                                <rect y="50" width="100" height="5"/>
                                <rect y="60" width="100" height="5"/>
                                <rect y="70" width="100" height="5"/>
                                <rect y="80" width="100" height="5"/>
                                <rect y="90" width="100" height="5"/>
                            </g>
                        </svg>
                    </div>
                    <svg className={styles.curve} fill="none" width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                        <g transform={`translate(${strokeWidth}, ${outerAreaSize + strokeWidth})`}>
                            <line stroke={handleLineColor || styles.colorHandleLine} strokeWidth="1" strokeLinecap="round" x1={this.startCoordinate[0]} y1={this.startCoordinate[1]} x2={this.startBezierHandle[0]} y2={this.startBezierHandle[1]} />
                            <line stroke={handleLineColor || styles.colorHandleLine} strokeWidth="1" strokeLinecap="round" x1={this.endCoordinate[0]} y1={this.endCoordinate[1]} x2={this.endBezierHandle[0]} y2={this.endBezierHandle[1]} />
                            <path stroke={curveLineColor || styles.colorCurveLine} strokeWidth={strokeWidth} strokeLinecap="round" d={`M${this.startCoordinate} C${this.startBezierHandle} ${this.endBezierHandle} ${this.endCoordinate}`} />
                        </g>
                    </svg>
                    <span
                        className={classNames({
                            [styles.handle]: true,
                            [styles.fixed]: true,
                        })}
                        style={{
                            top: `${this.startCoordinate[1] + outerAreaSize + strokeWidth}px`,
                            left: `${this.startCoordinate[0] + strokeWidth}px`,
                            borderColor: handleLineColor,
                            backgroundColor: fixedHandleColor,
                        }}
                    ></span>
                    <span
                        className={classNames({
                            [styles.handle]: true,
                            [styles.fixed]: true,
                        })}
                        style={{
                            top: `${this.endCoordinate[1] + outerAreaSize + strokeWidth}px`,
                            left: `${this.endCoordinate[0] + strokeWidth}px`,
                            borderColor: handleLineColor,
                            backgroundColor: fixedHandleColor,
                        }}
                    ></span>
                    <button
                        className={classNames({
                            [styles.handle]: true,
                            [styles.start]: true,
                            [startHandleClassName]: !!startHandleClassName,
                            [styles.active]: movingStartHandle,
                            [startHandleActiveClassName]: !!startHandleActiveClassName && movingStartHandle,
                        })}
                        style={{
                            top: `${this.startBezierHandle[1] + outerAreaSize + strokeWidth}px`,
                            left: `${this.startBezierHandle[0] + strokeWidth}px`,
                            color: startHandleColor,
                            backgroundColor: startHandleColor,
                        }}
                        onMouseDown={this.handleStartHandleStartMoving}
                        onTouchStart={this.handleStartHandleStartMoving}
                    ></button>
                    <button
                        className={classNames({
                            [styles.handle]: true,
                            [styles.end]: true,
                            [endHandleClassName]: !!endHandleClassName,
                            [styles.active]: movingEndHandle,
                            [endHandleActiveClassName]: !!endHandleActiveClassName && movingEndHandle,
                        })}
                        style={{
                            top: `${this.endBezierHandle[1] + outerAreaSize + strokeWidth}px`,
                            left: `${this.endBezierHandle[0] + strokeWidth}px`,
                            color: endHandleColor,
                            backgroundColor: endHandleColor,
                        }}
                        onMouseDown={this.handleEndHandleStartMoving}
                        onTouchStart={this.handleEndHandleStartMoving}
                    ></button>
                </div>
            </div>
        );
    }
}