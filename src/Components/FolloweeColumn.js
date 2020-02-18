import React, {Component} from 'react'
import PropTypes from 'prop-types';

import UserList from './UserList'
import AppContext from '../AppContext';

class FolloweeList extends Component {
    static contextType = AppContext;
    static propTypes = {
        currentView: PropTypes.string.isRequired,
        viewUsername: PropTypes.string,
        users: PropTypes.arrayOf(PropTypes.string).isRequired,
        onSwitchView: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        let title = null;
        const logined = (this.context.loginStatus === 'logined');
        if (logined) {
            title = '我关注的用户';
        } else {
            title = '登录后可以关注噢😉'
        }

        return (
            <div className="sticky-top" style={{top: "6rem"}}>
                <div className="card-header g-bg-gray-light-v5 g-brd-around">
                    <h3 className="h6 mb-0">
                        <i className="icon-eye g-pos-rel g-top-1 g-mr-5"></i> {title} <small></small>
                    </h3>
                </div>
                <UserList onSwitchView={this.props.onSwitchView} users={this.props.users} />
            </div>
        )
    }
}


export default FolloweeList