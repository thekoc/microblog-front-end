import React, { Component } from 'react';
import PropTypes from 'prop-types';
class Pagination extends Component {
    static propTypes = {
        totalPageNumber: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired,
        currentPageNumber: PropTypes.number.isRequired
    }
    
    constructor(props) {
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.props.totalPageNumber) {
            this.props.onPageChange(pageNumber);
        }
    }

    render() {
        const buttonBasicClass = "u-pagination-v1__item g-brd-around g-color-blue g-brd-blue g-bg-gray-dark-v2--hover g-brd-gray-dark-v2--hover g-color-white--hover g-rounded-50 g-pa-7-16";
        const disabledClass = " u-pagination-v1__item--disabled";
        return (
            <nav className="text-center" aria-label="Page Navigation">
            <ul className="list-inline">
                <li className="list-inline-item float-sm-left">
                    <a onClick={() => this.handlePageChange(this.props.currentPageNumber - 1)}
                        className={buttonBasicClass + (this.props.currentPageNumber <= 1 ? disabledClass : '')}
                        href="#" aria-label="Previous">
                        <span aria-hidden="true">
                        <i className="fa fa-angle-left g-mr-5"></i>
                            上一页
                        </span>
                        <span className="sr-only">Previous</span>
                    </a>
                </li>
                <li className="list-inline-item g-mt-10">
                    {
                        this.props.totalPageNumber !== null ?
                            <a className="g-color-gray-dark-v3 g-pa-7-14">{this.props.currentPageNumber} / {this.props.totalPageNumber} 页</a>
                            : '载入中...'
                    }
                   
                </li>
                <li className="list-inline-item float-sm-right">
                    <a onClick={() => this.handlePageChange(this.props.currentPageNumber + 1)}
                        className={buttonBasicClass + (this.props.currentPageNumber >= this.props.totalPageNumber ? disabledClass : '')}
                        href="#" aria-label="Next">
                        <span aria-hidden="true">
                            下一页
                        <i className="fa fa-angle-right g-ml-5"></i>
                        </span>
                        <span className="sr-only">Next</span>
                    </a>
                </li>
            </ul>
            </nav>
        )
    }
}


export default Pagination