import React from 'react';
import {Authenticate, SetUserId} from "../redux/actions";
import {connect} from "react-redux";
import PropTypes from 'prop-types';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: '',
            err_class: 'form-control editor edit-text',
        };
    }

    handleChangeEmail = event => {
        this.setState({
            email: event.target.value,
        });
    };

    handleChangePassword = event => {
        this.setState({
            password: event.target.value,
        });
    };

    handleSubmit = event => {
        fetch('http://localhost:8080/api/auth', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ email: this.state.email, password: this.state.password }),
        }).then((res) => (res.ok ? res.json() : Promise.reject(res))).then((result) => {
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('userId', result.data.user.id);
            localStorage.setItem('username', result.data.user.name);
            localStorage.setItem('avatar', result.data.user.avatar);
            this.props.Authenticate(result.data.token);
            this.props.SetUserId(result.data.user.id);
        }).catch((error) => {
            this.setState({
                error: 'Not valid login or password!',
                err_class: 'inputs form-control editor edit-text',
            });
            throw (error);
        });

        event.preventDefault();
    };

    render() {
         return (
             <div>
             <form onSubmit={this.handleSubmit}>
                 <h1>AUTHENTICATION</h1>
                 <div className="form-group">
                     <label>Email:</label>
                     <input className={this.state.err_class} name="email" pattern="[^ @]*@[^ @]*" type="text"
                            value={this.state.email} onChange={this.handleChangeEmail}/>
                 </div>
                 <div className="form-group">
                     <label>Password:</label>
                     <input className={this.state.err_class} type="password" value={this.state.password}
                            onChange={this.handleChangePassword}/>
                 </div>
                 <input className="btn btn-success" type="submit" value="Submit"/>
             </form>
                 <div className="error_message">
                     <h2>{this.state.error}</h2>
                 </div>
             </div>
         );
    }

}

const mapDispatchToProps = {
    Authenticate,
    SetUserId
};

LoginForm.propTypes = {
    Authenticate: PropTypes.func,
    SetUserId: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(LoginForm);



