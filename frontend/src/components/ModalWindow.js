import React, { Component } from 'react';
import Modal from 'react-modal';
import LoginForm from './LoginForm';
import {connect} from "react-redux";
import {Authenticate} from "../redux/actions";

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

// export default function ModalWindow(props) {
class ModalWindow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            err_class: 'form-control editor edit-text',
            open: false,
            modalIsOpen: false,
        };
    }

    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        //  this.subtitle.style.color = '#f00';
    };

    openModal = () => {
        this.setState({ modalIsOpen: true });
    };

    closeModal = () => {
        this.setState({
            modalIsOpen: false,
            email: '',
            password: '',
            error: '',
            err_class: 'form-control editor edit-text',
        });
    };

    static getDerivedStateFromProps() {
        Modal.setAppElement('body');
        return null;
    }

    render() {
        return (
            <div><button className="btn btn-info" onClick={this.openModal}>Login</button>
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                ref={React.createRef()}
                contentLabel="Example LoginForm"
            >
                <LoginForm />
                <button onClick={this.closeModal}>close</button>
            </Modal>
            </div>
        );
    }
}

const mapDispatchToProps = {
    Authenticate
};

export default connect(null, mapDispatchToProps)(ModalWindow);
