import React, { Component } from 'react';
import '../App.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Modal from 'react-modal';
import Popover from 'react-simple-popover';
import logo from "../logo.svg";
//import createBrowserHistory from 'history lib createBrowserHistory';
//import { Router } from "react-router";
//import App from "../App";

//const history = createBrowserHistory();

class Profile extends Component {

    constructor(props) {
        super(props);
        let formData = new FormData();
        let userId = JSON.parse(JSON.stringify(localStorage.getItem('userId')));
        let avatar = JSON.parse(JSON.stringify(localStorage.getItem('avatar')));
        let username = JSON.parse(JSON.stringify(localStorage.getItem('username')));
        this.state = {
            items: [],
            isLoaded: false,
            email: '',
            name: '',
            formData: formData,
            userId: userId,
            avatar: avatar,
            username: username,
            selectedFile: null,
            error: '',
            err_class: 'form-control editor edit-text',
            open: false,
            modalIsOpen: false
        };

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleClick(e) {
        this.setState({open: !this.state.open});
    }

    handleClose(e) {
        this.setState({open: false});
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //  this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    handleChangeEmail(event) {
        this.setState({
            email: event.target.value,
        });
    }

    handleChangeUsername(event) {
        this.setState({
            name: event.target.value,
        });
    }

    fileChangedHandler(event) {
        this.setState({selectedFile: event.target.files[0]});
        console.log(event.target.files);
    }

    removeItem(event) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('avatar');
        window.location.href = "http://localhost:3000";
        //this.props.history.push("/");
        event.preventDefault();
    }

    componentDidMount() {

        if(localStorage.getItem('token') == null){
            window.location.href = "http://localhost:3000";
        }
        else {
        fetch('http://www.site-monitoring.ua/blog/public/api/users/profile/'+this.state.userId,{method: 'get',headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }}).then(res => res.json()).then(json => {
            this.setState({
                items: json,
               // userId: json['data']['id'],
                name: json['data']['name'],
                email: json['data']['email']
            })
        });}

    }

    componentWillMount() {
        Modal.setAppElement('body');
    }

    updateProfile(event) {
        fetch('http://www.site-monitoring.ua/blog/public/api/users/profile/' + this.state.userId, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({'name': this.state.name, 'email': this.state.email})
        })
            .then(response =>
                response.json().then(json => {
                    return json;
                }));

        let variable = [];
        this.state.formData.append('image_path', this.state.selectedFile, this.state.selectedFile.name);
        console.log(this.state.formData.entries());
        for (var pair of this.state.formData.entries()) {
            variable[pair[0]] = pair[1];
            console.log(pair[0]+ ', ' + pair[1]);
        }
        console.log(variable);
        fetch('http://www.site-monitoring.ua/blog/public/api/fileUpload', {
            method: 'post',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: this.state.formData
        }).then(res => res.json()).then(function() {
        });

        event.preventDefault();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                    <div>
                        {
                            localStorage.getItem('token') == null ?
                                <button className="btn btn-info" onClick={this.openModal}>Login</button>
                                :
                                <a
                                    href="#"
                                    className="button"
                                    ref="target"
                                    onClick={this.handleClick.bind(this)}> <img className = "image_avatar" src={"http://www.site-monitoring.ua/blog/public/"+this.state.avatar} alt="" /></a>
                        }
                        <Popover
                            placement='bottom'
                            container={this}
                            target={this.refs.target}
                            show={this.state.open}
                            onHide={this.handleClose.bind(this)} >
                            <div>
                                {
                                    localStorage.getItem('token') == null ?
                                        null
                                        : this.state.username
                                }
                                <p><a href="/">Main</a></p>
                                <p><input type="submit" onClick={this.removeItem} value="Logout" /></p>
                            </div>
                        </Popover>
                    </div>
                </header>
                <div className="profile_field">
                    <img className="profile_img" src={"http://www.site-monitoring.ua/blog/public/"+this.state.avatar} alt="" />
                    <form onSubmit={this.updateProfile}>
                    <input type="file" name="image_path" onChange={this.fileChangedHandler} />
                    <div className="form-group">
                    <label>Username:</label>
                    <input className={this.state.err_class} type="text" value={this.state.name} onChange={this.handleChangeUsername}/>
                    </div>
                    <div className="form-group">
                    <label>Email:</label>
                    <input className={this.state.err_class} type="text" value={this.state.email} onChange={this.handleChangeEmail}/>
                    </div>
                    <input className="btn btn-success" type="submit" value="Save" />
                    </form>
                </div>
            </div>
        );
    }
}

export default Profile;