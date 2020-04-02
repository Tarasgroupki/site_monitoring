import React from 'react';
import PropTypes from 'prop-types';


function LoginForm(props) {
  return (
            <form onSubmit={props.handleSubmit}>
                <h1>AUTHENTICATION</h1>
                <div className="form-group">
                    <label>Email:</label>
                    <input className = {props.errClass} name="email" pattern="[^ @]*@[^ @]*" type="text" value={props.email} onChange={props.handleChangeEmail} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input className = {props.errClass} type="password" value={props.password} onChange={props.handleChangePassword} />
                </div>
                <input className="btn btn-success" type="submit" value="Submit" />
            </form>
  );
}

LoginForm.propTypes = {
    handleSubmit: PropTypes.func,
    errClass: PropTypes.string,
    email: PropTypes.string,
    handleChangeEmail: PropTypes.func,
    password: PropTypes.string,
    handleChangePassword: PropTypes.func
};

export default LoginForm;


