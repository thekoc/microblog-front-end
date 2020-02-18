import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './modal.css'

class Modal extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        let className = "";
        if (this.props.show) {
            className = "my-modal show-my-modal";
        } else {
            className = "my-modal";
        }
        

        return (
            <div className={className} onClick={this.props.onClosed}>
                <div style={{position: "absolute", width: "100%", height: "100%"}} className="row">
                    <div className="col-2"></div>
                    <div className="my-modal-content col-8 " onClick={(e) => e.stopPropagation()}>
                        {this.props.children}
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
        )
    }
}

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClosed: PropTypes.func,
    children: PropTypes.node.isRequired
}


export default Modal