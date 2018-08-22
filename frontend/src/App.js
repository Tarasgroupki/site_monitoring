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
        this.state = {
            items: [],
            isLoaded: false,
            link: '',
            email: '',
            period: '',
            selected: [],
            modalIsOpen: false
        };

        this.handleChangeLink = this.handleChangeLink.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePeriod = this.handleChangePeriod.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
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

    handleChangeLink(event) {
       // console.log(event.target.value);
        this.setState({
            link: event.target.value,
        });
    }

    handleChangeEmail(event) {
      //  console.log(event.target.value);
        this.setState({
             email: event.target.value
        });
    }

    handleChangePeriod(event) {
        this.setState({
             period: event.target.value
        });
    }

    handleSubmit(event) {
        fetch('http://www.site-monitoring.ua/blog/public/api/site', {
            method: 'post',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'link': this.state.link, 'email': this.state.email, 'period': this.state.period, 'user_id': 1, 'date_last_check': '2018-06-05', 'status': '0'})
        }).then(res => res.json()).then(function() {
        });
      //  event.componentDidMount();
        event.preventDefault();
    }

    componentDidMount() {

        fetch('http://www.site-monitoring.ua/blog/public/api/site',{method: 'get'}).then(res => res.json()).then(json => {
            this.setState({
                isLoaded: true,
                items: json,
            })
        });

    }
    componentWillMount() {
        Modal.setAppElement('body');
    }

    render() {
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

 return (
     <div className="App">
       <header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
         <h1 className="App-title">Welcome to React</h1>
           <div>
           <button className="btn btn-info" onClick={this.openModal}>Login</button>
           <Modal
               isOpen={this.state.modalIsOpen}
               onAfterOpen={this.afterOpenModal}
               onRequestClose={this.closeModal}
               style={customStyles}
               contentLabel="Example Modal"
           >
               <form onSubmit={this.handleSubmit}>
                   <h1>AUTHENTICATION</h1>
                   <table className="Form-table">
                       <tbody>
                       <tr>
                           <td>Link:</td>
                           <td><input className ="form-control" name="link" type="text" value={this.state.link} onChange={this.handleChangeLink} /></td>
                       </tr>
                       <tr>
                           <td>Email:</td>
                           <td><input className ="form-control" type="text" value={this.state.email} onChange={this.handleChangeEmail} /></td>
                       </tr>
                       <tr>
                           <td>Period:</td>
                           <td><input className ="form-control" type="number" value={this.state.period} onChange={this.handleChangePeriod} /></td>
                       </tr>
                       </tbody>
                   </table>
                   <input className="btn btn-success" type="submit" value="Submit" />
               </form>
               <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
               <button onClick={this.closeModal}>close</button>
               <div>I am a modal</div>
           </Modal>
       </div>
       </header>
                   <BootstrapTable data={items['data']} insertRow={ true } selectRow={ selectRowProp } deleteRow={ true } cellEdit={ cellEditProp } options={ options }>
                   <TableHeaderColumn isKey dataField='id'>
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
                   <TableHeaderColumn dataField='user_id'>
                       UserID
                   </TableHeaderColumn>
                   <TableHeaderColumn dataField='status'>
                       Status
                   </TableHeaderColumn>
               </BootstrapTable>
     </div>
   );
 }
}



export default App;
