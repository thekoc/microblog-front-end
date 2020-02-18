import React, { Component } from 'react';
import PropTypes from 'prop-types';

const uniqId = (function(){
    var i=0;
    return function() {
        return `id-${i++}`;
    }
})();

class Accordion extends Component {
    constructor(props) {
        super(props);
        this.button = React.createRef();
        this.state = {
            collapseId: uniqId()
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.collapsed !== this.props.collapsed) {
            this.button.current.click();
        }
    }

    render() {
        return (
            <div id="accordion-11" className="u-accordion u-accordion-bg-primary u-accordion-color-white"
                aria-multiselectable="true">
                <button ref={this.button} style={{display: "none"}} data-toggle="collapse" data-target={`#${this.state.collapseId}`}></button>
                <div className="card g-brd-none rounded-0">
                    <div id={`${this.state.collapseId}`} className="collapse" role="tabpanel" aria-labelledby="accordion-11-heading-01">
                        <div className="g-color-gray-dark-v5">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Accordion.propTypes = {
    children: PropTypes.element,
    collapsed: PropTypes.bool
}


export default Accordion