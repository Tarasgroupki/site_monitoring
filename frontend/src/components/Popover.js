import React from 'react';
import Popover from 'react-simple-popover';
import { Link } from 'react-router-dom';
import {UnAuthenticate, UnsetUserId} from "../redux/actions";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import history from "../history";

 class PopoverWindow extends React.Component {
     constructor(props) {
         super(props);
         const avatar = JSON.parse(JSON.stringify(localStorage.getItem('avatar')));
         const username = JSON.parse(JSON.stringify(localStorage.getItem('username')));
         const token = JSON.parse(JSON.stringify(localStorage.getItem('token')));
         const ref = 'target';

         this.state = {
            ref,
            username,
            avatar,
            token,
            open: false
         };
     }

     handleClick = () => {
         this.setState({ open: !this.state.open });
     };

     handleClose = () => {
         this.setState({ open: false });
     };

     removeAuth = event => {
         localStorage.removeItem('token');
         localStorage.removeItem('username');
         localStorage.removeItem('userId');
         localStorage.removeItem('avatar');
         this.props.UnAuthenticate();
         this.props.UnsetUserId();
         this.setState({
             open: false,
         });
         history.push('/');

         event.preventDefault();
     };

     render() {
         const style = {
           position:'relative'
         };
         return (
             <div style={style}><a
                 href="#main"
                 className="button"
                 ref={this.state.ref}
                 onClick={this.handleClick}> <img className = "image_avatar" src={`http://localhost:8080/${(this.props.avatar) ? this.props.avatar : this.state.avatar}`} alt="123" /></a>
             <Popover
                 placement='bottom'
                 container={this}
                 target={this.refs.target}
                 show={this.state.open}
                 onHide={this.handleClose}>
                 <div>
                     {
                         this.state.username
                     }
                     <p><Link to={this.props.link}>{this.props.title}</Link></p>
                     <p><input type="submit" onClick={this.removeAuth} value="Logout"/></p>
                 </div>
             </Popover>
     </div>
         );
     }
 }

const mapStateToProps = state => {
    return {
        link: state.links.link,
        title: state.links.title,
        avatar: state.avatar.avatar
    };
};

const mapDispatchToProps = {
    UnAuthenticate,
    UnsetUserId
};

PopoverWindow.propTypes = {
    UnAuthenticate: PropTypes.func,
    UnsetUserId: PropTypes.func,
    avatar: PropTypes.string,
    link: PropTypes.string,
    title: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(PopoverWindow);
