import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import { connect } from 'react-redux';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
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

class App extends Component {

    constructor(props) {
        super(props);
        let username = JSON.parse(JSON.stringify(localStorage.getItem('username')));
        this.state = {
            items: [],
           // users: [],
            isLoaded: false,
            email: '',
            password: '',
            username: username,
            selected: [],
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
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    handleChangeEmail(event) {
       // console.log(event.target.value);
        this.setState({
            email: event.target.value,
        });
    }

    handleChangePassword(event) {
      //  console.log(event.target.value);
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
            console.log(result['data']['user']);
            if(result['data'] != null) {
                localStorage.setItem('token', result['data']['token']);
                localStorage.setItem('userId', result['data']['user']['id']);
                localStorage.setItem('username', result['data']['user']['name']);
            }
        });
        if(localStorage.getItem('token')) {
            window.location.reload();
        }
        event.preventDefault();
    }

    removeItem(event) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        window.location.reload();
        event.preventDefault();
    }

    componentDidMount() {

        fetch('http://www.site-monitoring.ua/blog/public/api/site',{method: 'get'}).then(res => res.json()).then(json => {
            this.setState({
                isLoaded: true,
                items: json,
            })
        });
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
                    'Accept': 'application/json'
                },
                body: JSON.stringify(row)
            }).then(res => res.json()).then(function() {
            });
        }

        function onAfterDeleteRow(rowKeys) {
            var myarr = rowKeys.toString().split(",");
            for(var i = 0; i < myarr.length; i++) {
                fetch('http://www.site-monitoring.ua/blog/public/api/site'+'/'+myarr[i], {
                    method: 'delete',
                    headers : {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
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
            fetch('http://www.site-monitoring.ua/blog/public/api/site'+'/'+row["id"], {
                method: 'put',
                body: JSON.stringify(row),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
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


//console.log(this.state.user);
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
                           onClick={this.handleClick.bind(this)}>{this.state.username}</a>
               }
               <Popover
               placement='bottom'
               container={this}
               target={this.refs.target}
               show={this.state.open}
               onHide={this.handleClose.bind(this)} >
               <p><input type="submit" onClick={this.removeItem} value="Logout" /></p>
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
                   <input className =" form-control editor edit-text" name="email" type="text" value={this.state.email} onChange={this.handleChangeEmail} />
                   </div>
                   <div className="form-group">
                       <label>Password:</label>
                       <input className =" form-control editor edit-text" type="password" value={this.state.password} onChange={this.handleChangePassword} />
                   </div>
                   <input className="btn btn-success" type="submit" value="Submit" />
               </form>
               <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
               <button onClick={this.closeModal}>close</button>
           </Modal>
       </div>
       </header>
         {
             localStorage.getItem('token') == null ?
                 'Please log in to administrate this program!'
                 : <BootstrapTable data={items['data']} insertRow={ true } selectRow={ selectRowProp } deleteRow={ true } cellEdit={ cellEditProp } options={ options }>
                     <TableHeaderColumn isKey dataField='id' autoValue={ true }>
                         ID
                     </TableHeaderColumn>
                     <TableHeaderColumn dataField='link'>
                         Link
                     </TableHeaderColumn>
                     <TableHeaderColumn dataField='email'>
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
