import React from 'react';
import '../App.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import PopoverWindow from '../components/Popover';
import ProfileForm from "../components/ProfileForm";
import logo from '../logo.svg';
import {connect} from "react-redux";
import PropTypes from 'prop-types';

const Profile = ({auth}) => {
    return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div>
                      {
                        (localStorage.getItem('token') == null || auth === null)
                            ? null/*<button className="btn btn-info" onClick={this.openModal}>Login</button>*/
                            : <PopoverWindow />
                      }
                    </div>
                </header>
                <ProfileForm />
            </div>
    );
 };

const mapStateToProps = state => {
    return {
        auth: state.auth.auth
    };
};

Profile.propTypes = {
    auth: PropTypes.string
};

export default connect(mapStateToProps, null)(Profile);
