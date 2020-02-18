/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react'
import PropTypes from 'prop-types';

import SpinningButton from './SpinningButton'


class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

    handleSubmit() {
        this.props.onRequestLogin(this.state.username, this.state.password);
    }

    render() {
        return (
            <form className="g-py-15">
                <div className="mb-4">
                    <input onChange={this.handleInputChange}
                        className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-15 g-px-15"
                        type="text" name="username" placeholder="用户名" />
                </div>
        
                <div className="g-mb-35">
                    <input onChange={this.handleInputChange}
                        className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-15 g-px-15 mb-3"
                        type="password" name="password" placeholder="密码" />
                    <div className="row justify-content-between">
                        <div className="col align-self-center">
                            <label className="form-check-inline u-check g-color-gray-dark-v5 g-font-size-12 g-pl-25 mb-0">
                                <input onChange={this.handleInputChange}
                                    className="g-hidden-xs-up g-pos-abs g-top-0 g-left-0" name="remember" type="checkbox" />
                                <div className="u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0">
                                    <i className="fa" data-check-icon=""></i>
                                </div>
                                记住我
                            </label>
                        </div>
                        <div className="col align-self-center text-right">
                            <a href="#!" className="g-font-size-12">忘记密码？</a>
                        </div>
                    </div>
                </div>
        
                <div className="mb-4">
                    <SpinningButton spining={this.props.logining} onClick={this.handleSubmit} className="btn btn-md btn-block u-btn-outline-teal" type="button">登录</SpinningButton>
                </div>
            </form>
        )
    }
}

LoginForm.propTypes = {
    onRequestLogin: PropTypes.func,
    logining: PropTypes.bool
}



class Login extends Component {
    render() {
        return (
            <div className="g-brd-around g-brd-gray-light-v4 rounded g-py-20 g-px-15">
                <header className="text-center mb-4">
                    <h2 className="h2 g-color-black g-font-weight-600">登录</h2>
                </header>
            
                    <LoginForm onRequestLogin={this.props.onRequestLogin} logining={this.props.logining}/>
            
                <footer className="text-center">
                    <p className="g-color-gray-dark-v5 g-font-size-13 mb-0">还没有账号？<a onClick={this.props.onSwitchRegister} href="#!" className="g-font-weight-600">注册</a>
                    </p>
                </footer>
            </div>
        )
    }
}

Login.propTypes = {
    logining: PropTypes.bool,
    onRequestLogin: PropTypes.func,
    onSwitchRegister: PropTypes.func
}


export default Login