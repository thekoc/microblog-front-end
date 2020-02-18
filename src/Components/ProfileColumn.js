import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Profile from './Profile';
import Login from './Login'
import Register from './Register'

import requester from '../Requester'
import AppContext from '../AppContext'


class MyProfileColumn extends Component {
    static propTypes = {
        loginStatus: PropTypes.oneOf(["logining", "logined", "not-logined", null]),
        onRequestLogin: PropTypes.func,
        onRequestLogout: PropTypes.func,
        onSwitchView: PropTypes.func,
        onAvatarUploaded: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            email: null,
            showRegister: false,
            ready: false,
            registering: false
        }

        this.update = this.update.bind(this);
        this.handleToggleRegister = this.handleToggleRegister.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    async update() {
        const currentUser = await requester.getCurrentUser();
        if (currentUser !== null) {
            this.setState({
                username: currentUser.username,
                email: currentUser.email
            });
        }
    }

    async componentDidMount() {
        await this.update();
        requester.addStaleListener(requester.getCurrentUser, this.update);
    } 

    handleToggleRegister() {
        this.setState({showRegister: !this.state.showRegister});
    }

    async handleRegister(username, password, email) {
        try {
            this.setState({registering: true});
            await requester.register(username, password, email);
            alert('注册成功');
            this.handleToggleRegister();
        } catch (error) {
            alert(error);
        } finally {
            this.setState({registering: false});
        }
    }

    render() {
        if (this.props.loginStatus === "logined") {
            return (
                <div className="d-flex flex-column">
                    <Profile onAvatarUploaded={this.props.onAvatarUploaded} username={this.state.username} email={this.state.email} onSwitchView={this.props.onSwitchView}/>
                    <button onClick={this.props.onRequestLogout} className="btn u-btn-outline-lightred g-mt-5 g-mb-10">登出</button>
                </div>
            )
        } else if (this.state.showRegister) {
            return (
                <div className="d-flex flex-column">
                    <Register onRegister={this.handleRegister} registering={this.state.registering} onSwitchLogin={this.handleToggleRegister}/>
                </div>
            )
        } else {
            return (
                <div className="d-flex flex-column">
                    <Login logining={this.props.loginStatus === 'logining'} onRequestLogin={this.props.onRequestLogin} onSwitchRegister={this.handleToggleRegister}/>
                </div>
            )

        }
    }
}


class ProfileColumn extends Component {
    static contextType = AppContext;
    static propTypes = {
        currentView: PropTypes.string.isRequired,
        onRequestLogin: PropTypes.func,
        onRequestLogout: PropTypes.func,
        onSwitchView: PropTypes.func.isRequired,
        onAvatarUploaded: PropTypes.func
    }

    constructor(props) {
        super(props);

    }

    render() {
        const loginStatus = this.context.loginStatus;
        return (
            <div className="d-flex flex-column sticky-top" style={{top: "6rem"}}>
                <MyProfileColumn onAvatarUploaded={this.props.onAvatarUploaded} onSwitchView={this.props.onSwitchView} loginStatus={loginStatus} onRequestLogin={this.props.onRequestLogin} onRequestLogout={this.props.onRequestLogout}/>
            </div>
        )
    }
}





export default ProfileColumn
