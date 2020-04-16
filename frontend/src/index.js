import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Router, Switch, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import {compose, createStore} from "redux";
import { Provider } from 'react-redux';
import {rootReducer} from "./redux/rootReducer";
import Profile from "./profile/Profile";
import NotFound from "./not-found/NotFound";
import history from "./history";

const store = createStore(rootReducer, compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

ReactDOM.render(
    <Provider store={store}>
            <Router history={history}>
                    <Switch>
                            <Route exact path="/" component={App}/>
                            <Route path="/profile" component={Profile}/>
                            <Route path="*" component={NotFound}/>
                    </Switch>
            </Router>
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
