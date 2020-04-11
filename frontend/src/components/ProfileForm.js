import React from 'react';
import {Link, SetMainImg, Title, UnLink, UnSetMainImg, UnTitle} from "../redux/actions";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import history from "../history";


class ProfileForm extends React.Component {
    constructor(props) {
        super(props);
        const avatar = JSON.parse(JSON.stringify(localStorage.getItem('avatar')));
        const userId = JSON.parse(JSON.stringify(localStorage.getItem('userId')));

        this.state = {
            email: '',
            password: '',
            name: '',
            avatar,
            selectedFile: null,
            userId,
            error: ''
        };
    }

    handleChangeEmail = event => {
        this.setState({
            email: event.target.value,
        });
    };

    handleChangeUsername = event => {
        this.setState({
            name: event.target.value,
        });
    };

    fileChangedHandler = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    componentDidMount() {
        this.props.UnLink();
        this.props.UnTitle();
        this.props.Link('/');
        this.props.Title('Main');
        if (localStorage.getItem('token') == null) {
             history.push('/');
        } else {
            fetch(`http://localhost:8080/api/users/profile/${this.state.userId}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }).then((res) => res.json()).then((json) => {
                this.setState({
                    items: json,
                    name: json.data.name,
                    email: json.data.email,
                });
            });
        }
    }

    updateProfile = event => {
        const userObj = { name: this.state.name, email: this.state.email };
        if (this.state.selectedFile !== null) {
            const formData = new FormData();
            userObj.avatar = 'images/'+this.state.selectedFile.name;
            formData.append('image_path', this.state.selectedFile, this.state.selectedFile.name);
            fetch('http://localhost:8080/api/fileUpload', {
                method: 'post',
                body: formData,
                headers: {
                    Accept: 'application/json',
                  //  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },

            }).then((res) => res.json()).then((file) => file).catch(err => err);
        }
        fetch(`http://localhost:8080/api/users/profile/${this.state.userId}`, {
            method: 'put',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(userObj),
        }).then((response) => response.json().then((json) => {this.setState({avatar: json.data.avatar});
        this.props.UnSetMainImg();
        this.props.SetMainImg(json.data.avatar);
        localStorage.setItem('avatar', json.data.avatar)}));

        event.preventDefault();
    };

    render() {
        return (
            <div className="profile_field">
                <img className="profile_img" src={`http://localhost:8080/${this.state.avatar}`} alt="" />
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
        );
    }

}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth
    };
};

const mapDispatchToProps = {
    UnLink,
    UnTitle,
    Link,
    Title,
    SetMainImg,
    UnSetMainImg
};

ProfileForm.propTypes = {
    UnLink: PropTypes.func,
    UnTitle: PropTypes.func,
    Link: PropTypes.func,
    Title: PropTypes.func,
    UnSetMainImg: PropTypes.func,
    SetMainImg: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);
