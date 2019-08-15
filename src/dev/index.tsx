import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as styles from './index.scss';
import { BezierCurveEditor } from '../react';

interface IState {

}

class App extends React.Component<{}, IState> {
    public state = {

    }

    public render() {
        return (
            <main className={styles.main}>
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