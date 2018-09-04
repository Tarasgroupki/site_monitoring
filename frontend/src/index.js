import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Profile from './profile/Profile';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//import { Router } from "react-router";
//import createHistory from "history/createBrowserHistory"
import registerServiceWorker from './registerServiceWorker';

//const browserHistory = createHistory();

ReactDOM.render(<Router>
    <Switch>
    <Route exact path="/" component={App} />
    <Route path="/profile" component={Profile} />
    </Switch>
</Router>, document.getElementById('root'));
registerServiceWorker();
