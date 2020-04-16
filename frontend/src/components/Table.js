import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {Link, Title, UnLink, UnTitle} from "../redux/actions";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import "../Interceptor";

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

 class Table extends React.Component {
     constructor(props) {
         super(props);
         const userId = JSON.parse(JSON.stringify(localStorage.getItem('userId'))) ;

         this.state = {
             userId
         };
     }

     changeSites() {
         fetch('http://localhost:8080/api/site', {
             method: 'get',
             headers: {
                 'Content-Type': 'application/json',
                 Accept: 'application/json',
             },
         }).then((res) => res.json()).then((json) => {
             console.log(json);
             this.setState({
                 items: Array.from(json.data),
             });
         });
     }

     componentDidMount() {
         this.props.UnLink();
         this.props.UnTitle();
         this.props.Link('/profile');
         this.props.Title('Profile');
         this.changeSites();
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
             <BootstrapTable data={items} insertRow={true} selectRow={selectRowProp} deleteRow={true}
                             cellEdit={cellEditProp} options={options} pagination>
                 <TableHeaderColumn isKey dataField='id' autoValue={true}>
                     ID
                 </TableHeaderColumn>
                 <TableHeaderColumn dataField='link' editable={{validator: LinkValidator}}>
                     Link
                 </TableHeaderColumn>
                 <TableHeaderColumn dataField='email' editable={{validator: EmailValidator}}>
                     Email
                 </TableHeaderColumn>
                 <TableHeaderColumn dataField='period'>
                     Period
                 </TableHeaderColumn>
                 <TableHeaderColumn dataField='user_id' editable={{
                     type: 'hidden',
                     defaultValue: (this.props.userId) ? +this.props.userId : this.state.userId
                 }}>
                 </TableHeaderColumn>
                 <TableHeaderColumn dataField='status' autoValue={true}>
                     Status
                 </TableHeaderColumn>
             </BootstrapTable>
         );
     }
     }

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = {
    UnLink,
    UnTitle,
    Link,
    Title
};

Table.propTypes = {
    auth: PropTypes.string,
    UnLink: PropTypes.func,
    UnTitle: PropTypes.func,
    Link: PropTypes.func,
    Title: PropTypes.func,
    userId: PropTypes.string
};



export default connect(mapStateToProps, mapDispatchToProps)(Table);
