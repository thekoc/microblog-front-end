import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { dateDiffNowHumanReadable } from '../util';
import requester from '../Requester';

class UserInfo extends Component {
    static propTypes = {
        username: PropTypes.string,
        onSwitchView: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            lastActivityDate: null,
            avatarURL: requester.loadingAvatrURL
        }
        this.update = this.update.bind(this);
    }

    async update() {
        await this.setState({lastActivityDate: await requester.getLastActivityDate(this.props.username)});
    }

    async componentDidMount() {
        await this.update();
        requester.addStaleListener(requester.getLastActivityDate, this.update);
        this.setState({avatarURL: await requester.getAvatarURL(this.props.username)})
    }

    async componentWillUnmount() {
        requester.removeStaleListener(requester.getLastActivityDate, this.update);
    }

    render() {
        const username = this.props.username;
        return (
            <li className="g-brd-around g-brd-gray-light-v4 g-pa-20 g-mb-minus-1 g-transition-0_3 g-color-primary--hover">
                <div className="media">
                    <div className="d-flex g-mt-2 g-mr-15">
                        <img className="g-width-50 g-height-50 rounded-circle avatar" src={this.state.avatarURL}
                            alt="Image Description" />
                    </div>
                    <div className="media-body">
                        <p className="m-0"><strong><a onClick={() => this.props.onSwitchView('user-post', username)} href={'#' + username}>{username}</a></strong></p>
                        <span className="g-font-size-12">最近活动 <span className="g-color-blue">{dateDiffNowHumanReadable(this.state.lastActivityDate)}</span></span>
                    </div>
                </div>
            </li> 
        )
    }

}



class UserList extends Component {
    static propTypes = {
        users: PropTypes.arrayOf(PropTypes.string),
        onSwitchView: PropTypes.func
    }
    
    constructor(props) {
        super(props);
    }

    render() {
        const users = this.props.users.map((username) => (
                <UserInfo key={username} username={username} onSwitchView={this.props.onSwitchView} />
            )
        );

        return (
            <ul className="list-unstyled"> 
                {users}
            </ul>
        );
    }
}

export default UserList