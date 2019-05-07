import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import { connect } from 'react-redux';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
//import '../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
import {BootstrapTable,
    TableHeaderColumn} from 'react-bootstrap-table';
//import Dialog from 'react-bootstrap-dialog'
import Modal from 'react-modal';
import Popover from 'react-simple-popover';
//import Select from 'react-bootstrap-select';
//import Table from './Table';
//import { BrowserRouter as Router, Route, Link } from "react-router";
//import PropTypes from 'prop-types';
//import '../css/Table.css';


const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

function EmailValidator(value) {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
    if (!value) {
        response.isValid = false;
        response.notification.type = 'error';
        response.notification.msg = 'Value must be inserted';
        response.notification.title = 'Requested Value';
    } else if (value.length < 10) {
        response.isValid = false;
        response.notification.type = 'error';
        response.notification.msg = 'Value must have 10+ characters';
        response.notification.title = 'Invalid Value';
    } else if (value.search('@') === -1) {
        response.isValid = false;
        response.notification.type = 'error';
        response.notification.msg = 'Value must have symbol @';
        response.notification.title = 'Invalid Value';
    }
    return response;
}

function LinkValidator(value) {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
    if (!value) {
        response.isValid = false;
        response.notification.type = 'error';
        response.notification.msg = 'Value must be inserted';
        response.notification.title = 'Requested Value';
    } else if (value.length < 10) {
        response.isValid = false;
        response.notification.type = 'error';
        response.notification.msg = 'Value must have 10+ characters';
        response.notification.title = 'Invalid Value';
    }
    return response;
}

class App extends Component {

    constructor(props) {
        super(props);
        let avatar = JSON.parse(JSON.stringify(localStorage.getItem('avatar')));
        let username = JSON.parse(JSON.stringify(localStorage.getItem('username')));
        this.state = {
            items: [],
           // users: [],
            isLoaded: false,
            email: '',
            password: '',
            avatar: avatar,
            username: username,
            selected: [],
            error: '',
            err_class: 'form-control editor edit-text',
            open: false,
            modalIsOpen: false
        };

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleChangePassword(event) {
        this.setState({
             password: event.target.value
        });
    }

    handleSubmit(event) {
        fetch('http://www.site-monitoring.ua/blog/public/api/auth', {
            method: 'post',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'email': this.state.email, 'password': this.state.password})
        }).then(res => res.json()).then(function(result) {
            if(result['data'] != null) {
                localStorage.setItem('token', result['data']['token']);
                localStorage.setItem('userId', result['data']['user']['id']);
                localStorage.setItem('username', result['data']['user']['name']);
                localStorage.setItem('avatar', result['data']['user']['avatar']);
                window.location.reload();
            }
        });
        if(!localStorage.getItem('token')) {
            this.setState({
                error: 'Not valid login or password!',
                err_class: 'inputs form-control editor edit-text'
            });
        }
        event.preventDefault();
    }

    removeItem(event) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('avatar');
        window.location.reload();
        event.preventDefault();
    }

    componentDidMount() {

        if(localStorage.getItem('token') != null)
        {

        fetch('http://www.site-monitoring.ua/blog/public/api/site',{method: 'get',headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }}).then(res => res.json()).then(json => {
            this.setState({
                isLoaded: true,
                items: json,
            })
        });
        console.log(localStorage.getItem('token'));
        }
      /*  fetch('http://www.site-monitoring.ua/blog/public/api/users',{method: 'get'}).then(res => res.json()).then(json => {
            this.setState({
                isLoaded: true,
                users: json,
            })
        });*/


    }

    componentWillMount() {
        Modal.setAppElement('body');
    }

    render() {
       /* var user = [];
        console.log(this.state.users);
        console.log(this.state.users['data']);
        for(var i = 0; i < 1; i++) {
            if(this.state.users['data'] != null) {
                //console.log(this.state.users['data'][i]['name']);
                user[this.state.users['data'][i]['id']] = this.state.users['data'][i]['name'];
            }
        }*/
       // console.log(user[1]);
        //this.getUsers();
        var { isLoaded, items } = this.state;
        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            selected: this.state.selected  //give a default selected row.
           // bgColor: 'orange', // you should give a bgcolor, otherwise, you can't regonize which row has been selected
          //  hideSelectColumn: true,  // enable hide selection column.
          //  clickToSelect: true  // you should enable clickToSelect, otherwise, you can't select column.
        };
        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
            afterSaveCell: onAfterSaveCell  // a hook for after saving cell
        };
        if(!isLoaded) {
            console.log('Err');
        }
        function onAfterInsertRow(row) {
            fetch('http://www.site-monitoring.ua/blog/public/api/site', {
                method: 'post',
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(row)
            }).then(res => res.json()).then(function() {
            });
        }

        function onAfterDeleteRow(rowKeys) {
            var myarr = rowKeys.toString().split(",");
            for(var i = 0; i < myarr.length; i++) {
                fetch('http://www.site-monitoring.ua/blog/public/api/site/'+myarr[i], {
                    method: 'delete',
                    headers : {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response =>
                    response.json().then(json => {
                        return json;
                    }));
            }
            alert('The rowkey you drop: ' + rowKeys);
        }

        function onAfterSaveCell(row, cellName, cellValue) {
            alert(`Save cell ${cellName} with value ${cellValue}`);
            fetch('http://www.site-monitoring.ua/blog/public/api/site/'+row["id"], {
                method: 'put',
                body: JSON.stringify(row),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(response =>
                    response.json().then(json => {
                        return json;
                    }));
        }

        function onBeforeSaveCell(row, cellName, cellValue) {
            return true;
        }

        const options = {
            afterDeleteRow: onAfterDeleteRow,  // A hook for after droping rows.
            afterInsertRow: onAfterInsertRow   // A hook for after insert rows
        };


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
                   <p><a href="/profile">Profile</a></p>
               <p><input type="submit" onClick={this.removeItem} value="Logout" /></p>
                   </div>
               </Popover>
           <Modal
               isOpen={this.state.modalIsOpen}
               onAfterOpen={this.afterOpenModal}
               onRequestClose={this.closeModal}
               style={customStyles}
               contentLabel="Example Modal"
           >
               <form onSubmit={this.handleSubmit}>
                   <h1>AUTHENTICATION</h1>
                   <div className="form-group">
                       <label>Email:</label>
                   <input className = {this.state.err_class} name="email" pattern="[^ @]*@[^ @]*" type="text" value={this.state.email} onChange={this.handleChangeEmail} />
                   </div>
                   <div className="form-group">
                       <label>Password:</label>
                       <input className = {this.state.err_class} type="password" value={this.state.password} onChange={this.handleChangePassword} />
                   </div>
                   <input className="btn btn-success" type="submit" value="Submit" />
               </form>
               <div className="error_message">
                   <h2>{this.state.error}</h2>
               </div>
               <button onClick={this.closeModal}>close</button>
           </Modal>
       </div>
       </header>
         {
             localStorage.getItem('token') == null ?
                 <h2>Please log in to administrate this program!</h2>
                 : <BootstrapTable data={items['data']} insertRow={ true } selectRow={ selectRowProp } deleteRow={ true } cellEdit={ cellEditProp } options={ options } pagination>
                     <TableHeaderColumn isKey dataField='id' autoValue={ true }>
                         ID
                     </TableHeaderColumn>
                     <TableHeaderColumn dataField='link' editable={ { validator: LinkValidator } }>
                         Link
                     </TableHeaderColumn>
                     <TableHeaderColumn dataField='email' editable={ { validator: EmailValidator } }>
                         Email
                     </TableHeaderColumn>
                     <TableHeaderColumn dataField='period'>
                         Period
                     </TableHeaderColumn>
                     <TableHeaderColumn dataField='user_id' editable={ { type: 'hidden', defaultValue: localStorage.getItem('userId') } } >
                     </TableHeaderColumn>
                     <TableHeaderColumn dataField='status' autoValue={ true }>
                         Status
                     </TableHeaderColumn>
                 </BootstrapTable>
         }
     </div>
   );
 }
}



export default App;
