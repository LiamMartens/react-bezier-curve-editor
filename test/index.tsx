import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BezierCurveEditor } from '../lib';

interface IState {

}

class App extends React.Component<{}, IState> {
    public state = {

    }

    public render() {
        return (
            <main>
                <BezierCurveEditor
                    size={300}
                />
            </main>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app'),
);