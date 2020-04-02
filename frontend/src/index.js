import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Router, Switch, Route } from 'react-router-dom';
import App from './App';
import Profile from './profile/Profile';
import NotFound from './NotFound.js';
// import { Router } from "react-router";
// import createHistory from "history/createBrowserHistory"
import registerServiceWorker from './registerServiceWorker';
import history from './history';

// const browserHistory = createHistory();

ReactDOM.render(<Router history={history}>
    <Switch>
    <Route exact path="/" component={App} />
    <Route path="/profile" component={Profile} />
    <Route path="*" component={NotFound} />
    </Switch>
</Router>, document.getElementById('root'));
registerServiceWorker();
