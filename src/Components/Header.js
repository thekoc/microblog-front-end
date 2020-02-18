import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Header extends Component {
    static propTypes = {
        logoUrl: PropTypes.string,
        navigationItems: PropTypes.arrayOf(PropTypes.string).isRequired,
        onNavigateTo: PropTypes.func.isRequired,
        current: PropTypes.string
    }

    constructor(props) {
        super(props);
    }

    render() {
        const navigationLiTags = this.props.navigationItems.map((item) => {
            let className = null;
            if (this.props.current === item) {
                className = "g-color-primary";
            }
            return (
                <li key={item} className="nav-item g-ml-50--lg g-mr-0--lg">
                    <a onClick={() => this.props.onNavigateTo(item)} href="#!" className="nav-link px-0">
                        <span className={className}>{item}</span> 
                    </a>
                </li>
            )
        })

        return (
            <div className="u-shadow-v18 ">
            <header id="js-header"
                className="u-header u-header--static u-header--show-hide u-header--change-appearance u-header--untransitioned"
                data-header-fix-moment="500" data-header-fix-effect="slide">
                <div className="u-header__section u-header__section--light g-transition-0_3 g-bg-white g-py-10"
                    data-header-fix-moment-exclude="g-bg-white g-py-10"
                    data-header-fix-moment-classes="g-bg-white-opacity-0_7 u-shadow-v18 g-py-0">
                    <nav className="navbar navbar-expand-lg">
                        <div className="container">
                            {/* <!-- Responsive Toggle Button --> */}
                            <button
                                className="navbar-toggler navbar-toggler-right btn g-line-height-1 g-brd-none g-pa-0 g-pos-abs g-top-3 g-right-0"
                                type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navBar"
                                data-toggle="collapse" data-target="#navBar">
                                <span className="hamburger hamburger--slider">
                                    <span className="hamburger-box">
                                        <span className="hamburger-inner"></span>
                                    </span>
                                </span>
                            </button>
                            {/* <!-- End Responsive Toggle Button --> */}
                            {/* <!-- Logo --> */}
                            <a href="." className="navbar-brand">
                                <img style={{height: "3rem"}} src={this.props.logoUrl} alt="Logo" />
                            </a>
                            {/* <!-- End Logo --> */}

                            {/* <!-- Navigation --> */}
                            <div className="collapse navbar-collapse align-items-center flex-sm-row g-pt-10 g-pt-5--lg" id="navBar">
                                <ul className="navbar-nav text-uppercase g-font-weight-600 ml-auto">
                                    {navigationLiTags}
                                </ul>
                            </div>
                            {/* <!-- End Navigation --> */}
                        </div>
                    </nav>
                </div>
            </header>
            </div>

        )
    }
}

export default Header