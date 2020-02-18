import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SpinningButton from './SpinningButton';

class RegisterForm extends Component {
    static propTypes = {
        registering: false,
        onSubmit: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            passwordReconfirm: '',
            userTermConfirmed: false,
            email: ''
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
        if (this.state.password !== this.state.passwordReconfirm) {
            alert('密码不一致！');
        } else if (!this.state.userTermConfirmed) {
            alert('请确认条款！')
        } else {
            this.props.onSubmit(this.state.username, this.state.password, this.state.email);
        }
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
                    <input onChange={this.handleInputChange}
                        className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-15 g-px-15 mb-3"
                        type="password" name="passwordReconfirm" placeholder="确认密码" />
                    <input onChange={this.handleInputChange}
                        className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-15 g-px-15 mb-3"
                        type="text" name="email" placeholder="邮箱" />
                    <div className="row justify-content-between">
                        <div className="col align-self-center">
                            <label className="form-check-inline u-check g-color-gray-dark-v5 g-font-size-12 g-pl-25 mb-0">
                                <input onChange={this.handleInputChange}
                                    className="g-hidden-xs-up g-pos-abs g-top-0 g-left-0" name="userTermConfirmed" type="checkbox" />
                                <div className="u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0">
                                    <i className="fa" data-check-icon=""></i>
                                </div>
                                我接受 <a href="#">用户条款</a>
                            </label>
                        </div>
                    </div>
                </div>
        
                <div className="mb-4">
                    <SpinningButton spining={this.props.registering} onClick={this.handleSubmit} className="btn btn-md btn-block u-btn-outline-teal" type="button">注册</SpinningButton>
                </div>
            </form>
        )
    }
}


class Register extends Component {
    static propTypes = {
        onRegister: PropTypes.func.isRequired,
        registering: PropTypes.func,
        onSwitchLogin: PropTypes.func.isRequired
    }
    render() {
        return (
            <div className="g-brd-around g-brd-gray-light-v4 rounded g-py-20 g-px-15">
                <header className="text-center mb-4">
                    <h2 className="h2 g-color-black g-font-weight-600">注册</h2>
                </header>
            
                    <RegisterForm onSubmit={this.props.onRegister} registering={this.props.registering}/>
            
                <footer className="text-center">
                    <p className="g-color-gray-dark-v5 g-font-size-13 mb-0">已有账号？<a onClick={this.props.onSwitchLogin} href="#!" className="g-font-weight-600">登录</a>
                    </p>
                </footer>
            </div>
        )
    }
}

export default Register