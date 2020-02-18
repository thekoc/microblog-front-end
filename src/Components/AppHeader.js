import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';

class AppHeader extends Component {
    static propTypes = {
        logoUrl: PropTypes.string.isRequired,
        currentView: PropTypes.string.isRequired,
        onSwitchView: PropTypes.func.isRequired,
        logined: PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state = {
            items: ['主页', '我的关注', '我的收藏']
        }
        
        this.handleNavigateTo = this.handleNavigateTo.bind(this);
    }

    static getDerivedStateFromProps(props) {
        if (props.logined) {
            return {items: ['主页', '我的关注', '我的收藏']};
        } else {
            return {items: ['主页']}
        }
    }

    handleNavigateTo(item) {
        if (item === '主页') {
            this.props.onSwitchView('main-page', null);
        } else if (item === '我的关注') {
            this.props.onSwitchView('followee-post', null);
        } else if (item === '我的收藏') {
            this.props.onSwitchView('stared-post', null);
        }
    }

    get current() {
        const currentView = this.props.currentView;
        if (currentView === 'main-page') {
            return '主页';
        } else if (currentView === 'followee-post') {
            return '我的关注';
        } else if (currentView === 'stared-post') {
            return '我的收藏';
        } else if (currentView === 'private-message') {
            return '私信';
        } else {
            return null;
        }
    }

    render() {
        return (
            <Header current={this.current} logoUrl={this.props.logoUrl} onNavigateTo={this.handleNavigateTo} navigationItems={this.state.items}/>
        )
    }
}


export default AppHeader