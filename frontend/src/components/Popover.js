import React from 'react';
import Popover from 'react-simple-popover';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

 function PopoverWindow(props) {
  return (
    <Popover
        placement='bottom'
        container={props.context}
        target={props.target}
        show={props.open}
        onHide={props.handleClose.bind(props.context)} >
        <div>
            {
                props.username
            }
            <p><Link to={props.link} >{props.title}</Link></p>
            <p><input type="submit" onClick={props.removeItem} value="Logout" /></p>
        </div>
    </Popover>
  );
}

PopoverWindow.propTypes = {
    context: PropTypes.object,
    target: PropTypes.object,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    link: PropTypes.string,
    title: PropTypes.string,
    removeItem: PropTypes.func
};

export default PopoverWindow;
