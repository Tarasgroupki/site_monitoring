import React, { Component } from 'react';
import '../App.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Modal from 'react-modal';
import { BehaviorSubject } from 'rxjs';
import PopoverWindow from '../components/Popover';
import logo from '../logo.svg';
import history from '../history';

class Profile extends Component {
  constructor(props) {
    super(props);
    const formData = new FormData();
    const avatar = (localStorage.getItem('avatar')) ? JSON.parse(JSON.stringify(localStorage.getItem('avatar'))) : new BehaviorSubject(null);
    const username = (localStorage.getItem('username')) ? JSON.parse(JSON.stringify(localStorage.getItem('username'))) : new BehaviorSubject(null);
    //  const token = (localStorage.getItem('token')) ? JSON.parse(JSON.stringify(localStorage.getItem('token'))) : new BehaviorSubject(null);
    const userId = (localStorage.getItem('userId')) ? JSON.parse(JSON.stringify(localStorage.getItem('userId'))) : new BehaviorSubject(null);
    this.state = {
      items: [],
      isLoaded: false,
      email: '',
      name: '',
      formData,
      userId,
      avatar,
      username,
      selectedFile: null,
      error: '',
      err_class: 'form-control editor edit-text',
      open: false,
      modalIsOpen: false,
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleClick() {
    this.setState({ open: !this.state.open });
  }

  handleClose() {
    this.setState({ open: false });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    return true;
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
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
    this.setState({ selectedFile: event.target.files[0] });
    // console.log(event.target.files);
  }

  removeAuth(event) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('avatar');
    // window.location.href = 'http://localhost:3000';
    history.push('/');
    event.preventDefault();
  }

  componentDidMount() {
    if (localStorage.getItem('token') == null) {
      // window.location.href = 'http://localhost:3000';
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
          // userId: json['data']['id'],
          name: json.data.name,
          email: json.data.email,
        });
      });
    }
  }

  UNSAFE_componentWillMount() {
    Modal.setAppElement('body');
  }

  updateProfile(event) {
    fetch(`http://localhost:8080/api/users/profile/${this.state.userId}`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name: this.state.name, email: this.state.email }),
    })
      .then((response) => response.json().then((json) => json));

    const variable = [];
    this.state.formData.append('image_path', this.state.selectedFile, this.state.selectedFile.name);
    // console.log(this.state.formData.entries());
    for (const pair of this.state.formData.entries()) {
      variable[pair[0]] = pair[1];
      // console.log(`${pair[0]}, ${pair[1]}`);
    }
    //  console.log(variable);
    fetch('http://localhost:8080/api/fileUpload', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: this.state.formData,
    }).then((res) => res.json()).then(() => {
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
                            localStorage.getItem('token') == null
                              ? <button className="btn btn-info" onClick={this.openModal}>Login</button>
                              : <a
                                    href="#profile"
                                    className="button"
                                    ref="target"
                                    onClick={this.handleClick.bind(this)}> <img className = "image_avatar" src={`http://localhost:8080/${this.state.avatar}`} alt="" /></a>
                        }
                      <PopoverWindow context={this} target={this.refs.target} open={this.state.open} handleClose={this.handleClose} username={this.state.username} link={'/'} title={'Main'} removeItem={this.removeAuth} />
                    </div>
                </header>
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
            </div>
    );
  }
}

export default Profile;
