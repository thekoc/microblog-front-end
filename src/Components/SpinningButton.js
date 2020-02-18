import React, { Component } from 'react';
import PropTypes from 'prop-types';
class SpningButton extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        let {spining, ...rest} = this.props;
        return (
            <button {...rest}>
                {!spining ? this.props.children :  <i className="fa fa-circle-o-notch fa-spin"></i>}
            </button>
        )
    }
}

SpningButton.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    spining: PropTypes.bool
}

export default SpningButton