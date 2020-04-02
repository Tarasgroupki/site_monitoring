import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PropTypes from 'prop-types';

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

 function Table(props) {
  return (
       <BootstrapTable data={props.items} insertRow={ true } selectRow={ props.selectRowProp } deleteRow={ true } cellEdit={ props.cellEditProp } options={ props.options } pagination>
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
           <TableHeaderColumn dataField='user_id' editable={ { type: 'hidden', defaultValue: (props.userId._value) ? props.userId._value : localStorage.getItem('userId') } } >
           </TableHeaderColumn>
           <TableHeaderColumn dataField='status' autoValue={ true }>
               Status
           </TableHeaderColumn>
       </BootstrapTable>
  );
}

Table.propTypes = {
  items: PropTypes.array,
  userId: PropTypes.object,
  selectRowProp: PropTypes.object,
  cellEditProp: PropTypes.object,
  options: PropTypes.object,
};

export default Table;
