import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import { connect } from 'react-redux';
import {BootstrapTable,
    TableHeaderColumn} from 'react-bootstrap-table';
//import '../css/Table.css';
import '../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false,
            link: 'val',
            email: 'val1',
            period: ''
        };

        this.handleChangeLink = this.handleChangeLink.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePeriod = this.handleChangePeriod.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeLink(event) {
        console.log(event.target.value);
        this.setState({
            link: event.target.value,
        });
    }

    handleChangeEmail(event) {
        console.log(event.target.value);
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
        event.componentDidMount();
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


    render() {
        var { isLoaded, items } = this.state;

        if(!isLoaded) {
            console.log('Err');
        }
      //  console.log(items);
      /* return (
            <div className="App">
                {items.map(item => (
                   <li key={item.id}>
                       {item.link}
                   </li>
                ))};
            </div>
        );*/
//items['data'][0]['user_id'] = '<button>Edit</button>';
 return (
     <div className="App">
       <header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
         <h1 className="App-title">Welcome to React</h1>
       </header>
               <BootstrapTable data={items['data']}>
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
       <form onSubmit={this.handleSubmit}>
           <table className="Form-table">
               <tbody>
               <tr>
                   <td>Link:</td>
                   <td><input name="link" type="text" value={this.state.link} onChange={this.handleChangeLink} /></td>
               </tr>
            <tr>
                <td>Email:</td>
                <td><input type="text" value={this.state.email} onChange={this.handleChangeEmail} /></td>
            </tr>
               <tr>
                   <td>Period:</td>
                   <td><input type="number" value={this.state.period} onChange={this.handleChangePeriod} /></td>
               </tr>
               </tbody>
           </table>
           <input type="submit" value="Submit" />
     </form>
     </div>
   );
 }
}



export default App;
