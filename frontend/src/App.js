import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import LoginForm from './components/LoginForm';
import Modal from 'react-modal';
import Table from './components/Table';
import PopoverWindow from './components/Popover';
// import history from "./history";
import { BehaviorSubject } from 'rxjs';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    const avatar = (localStorage.getItem('avatar')) ? JSON.parse(JSON.stringify(localStorage.getItem('avatar'))) : new BehaviorSubject(null);
    const username = (localStorage.getItem('username')) ? JSON.parse(JSON.stringify(localStorage.getItem('username'))) : new BehaviorSubject(null);
    const token = (localStorage.getItem('token')) ? JSON.parse(JSON.stringify(localStorage.getItem('token'))) : new BehaviorSubject(null);
    const userId = (localStorage.getItem('userId')) ? JSON.parse(JSON.stringify(localStorage.getItem('userId'))) : new BehaviorSubject(null);
    this.state = {
      items: [],
      email: '',
      password: '',
      avatar,
      username,
      token,
      userId,
      selected: [],
      error: '',
      err_class: 'form-control editor edit-text',
      open: false,
      modalIsOpen: false,
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.removeAuth = this.removeAuth.bind(this);
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
    // references are now sync'd and can be accessed.
    //  this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      email: '',
      password: '',
      error: '',
      err_class: 'form-control editor edit-text',
    });
  }

  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handleChangePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  handleSubmit(event) {
    fetch('http://localhost:8080/api/auth', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: this.state.email, password: this.state.password }),
    }).then((res) => (res.ok ? res.json() : Promise.reject(res))).then((result) => {
      this.state.avatar.next(result.data.user.avatar);
      this.state.username.next(result.data.user.name);
      this.state.token.next(result.data.token);
      this.state.userId.next(result.data.userId);
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('userId', result.data.user.id);
      localStorage.setItem('username', result.data.user.name);
      localStorage.setItem('avatar', result.data.user.avatar);
      this.closeModal();
      this.changeSites();
      // history.push('/profile');
      // window.location.reload();
    }).catch((error) => {
      this.setState({
        error: 'Not valid login or password!',
        err_class: 'inputs form-control editor edit-text',
      });
      throw (error);
    });
    event.preventDefault();
  }

  removeAuth(event) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('avatar');
    this.setState({
      avatar: new BehaviorSubject(null),
      username: new BehaviorSubject(null),
      userId: new BehaviorSubject(null),
      token: new BehaviorSubject(null),
      open: false,
    });
    // window.location.reload();
    event.preventDefault();
  }

  changeSites() {
    if (localStorage.getItem('token') != null || this.state.token._value != null) {
      fetch('http://localhost:8080/api/site', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${(localStorage.getItem('token')) ? localStorage.getItem('token') : this.state.token._value}`,
        },
      }).then((res) => res.json()).then((json) => {
        this.setState({
          items: json,
        });
      });
    }
  }

  componentDidMount() {
    this.changeSites();
  }

  UNSAFE_componentWillMount() {
    Modal.setAppElement('body');
  }

  render() {
    const { items } = this.state;
    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.selected,
    };
    const cellEditProp = {
      mode: 'click',
      blurToSave: true,
      beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: onAfterSaveCell, // a hook for after saving cell
    };
    function onAfterInsertRow(row) {
      fetch('http://localhost:8080/api/site', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(row),
      }).then((res) => res.json()).then(() => {
      });
    }

    function onAfterDeleteRow(rowKeys) {
      const myarr = rowKeys.toString().split(',');
      for (let i = 0; i < myarr.length; i++) {
        fetch(`http://localhost:8080/api/site/${myarr[i]}`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((response) => response.json().then((json) => json));
      }
      alert(`The rowkey you drop: ${rowKeys}`);
    }

    function onAfterSaveCell(row, cellName, cellValue) {
      alert(`Save cell ${cellName} with value ${cellValue}`);
      fetch(`http://localhost:8080/api/site/${row.id}`, {
        method: 'put',
        body: JSON.stringify(row),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json().then((json) => json));
    }

    function onBeforeSaveCell() {
      return true;
    }

    const options = {
      afterDeleteRow: onAfterDeleteRow, // A hook for after droping rows.
      afterInsertRow: onAfterInsertRow, // A hook for after insert rows
    };

    return (
     <div className="App">
       <header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
         <h1 className="App-title">Welcome to React</h1>
           <div>
               {
                 (localStorage.getItem('token') == null)
                   ? <button className="btn btn-info" onClick={this.openModal}>Login</button>
                   : <a
                           href="#main"
                           className="button"
                           ref="target"
                           onClick={this.handleClick.bind(this)}> <img className = "image_avatar" src={`http://localhost:8080/${(this.state.avatar._value) ? this.state.avatar._value : this.state.avatar}`} alt="123" /></a>
               }
             <PopoverWindow context={this} target={this.refs.target} open={this.state.open} handleClose={this.handleClose} username={(this.state.username._value) ? this.state.username._value : this.state.username} link={'/profile'} title={'Profile'} removeItem={this.removeAuth} />
           <Modal
               isOpen={this.state.modalIsOpen}
               onAfterOpen={this.afterOpenModal}
               onRequestClose={this.closeModal}
               style={customStyles}
               contentLabel="Example LoginForm"
           >
             <LoginForm handleSubmit={this.handleSubmit} errClass={this.state.err_class} email={this.state.email} handleChangeEmail={this.handleChangeEmail} password={this.state.password} handleChangePassword={this.handleChangePassword} />
               <div className="error_message">
                   <h2>{this.state.error}</h2>
               </div>
               <button onClick={this.closeModal}>close</button>
           </Modal>
       </div>
       </header>
         {
             localStorage.getItem('token') == null
               ? <h2>Please log in to administrate this program!</h2>
               : <Table items={items.data} selectRowProp={selectRowProp} cellEditProp={cellEditProp} options={options} userId={this.state.userId} />
         }
     </div>
    );
  }
}

export default App;
