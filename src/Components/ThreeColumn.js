import React, { Component } from 'react'
import PropTypes from 'prop-types';

class ThreeColumnContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        {this.props.left}
                    </div>
                    <div className="col-lg-6">
                        {this.props.middle}
                    </div>
                    <div className="col-lg-3">
                        {this.props.right}
                    </div>
                </div>
            </div>
        ) 
    }
}

ThreeColumnContainer.propTypes = {
    left: PropTypes.element,
    middle: PropTypes.element,
    right: PropTypes.element,
}

export default ThreeColumnContainer