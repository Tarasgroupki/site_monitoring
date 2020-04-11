import React from 'react';
import logo from './logo.svg';
import './App.css';
import ModalWindow from "./components/ModalWindow";
import PopoverWindow from "./components/Popover";
import Table from './components/Table';
import {connect} from "react-redux";
import PropTypes from 'prop-types';

const App = ({auth}) => {
        return (
            <div ref={React.createRef()} className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    {
                        (localStorage.getItem('token') == null && auth === '') ?
                            <ModalWindow/> : <PopoverWindow/>
                    }
                </header>
                {
                    (localStorage.getItem('token') == null && auth === '')
                        ? <h2>Please log in to administrate this program!</h2>
                        : <Table/>
                }
            </div>
        );
};

const mapStateToProps = state => {
    return {
        auth: state.auth.auth
    };
};

App.propTypes = {
  auth: PropTypes.string
};

export default connect(mapStateToProps, null)(App);
