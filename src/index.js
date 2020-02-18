
/* eslint-disable import/first */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
// import Login from './Components/Login';
// import Register from './Components/Register';
import AppHeader from './Components/AppHeader';
// import Posts from './Components/Post';
import ProfileColum from './Components/ProfileColumn';
import ThreeColumnContainer from './Components/ThreeColumn';
import FolloweeColumn from './Components/FolloweeColumn'
import PostModal from './Components/PostModal'
import PostColumn from './Components/PostColum'
import requester from './Requester'
import AppContext from './AppContext'



import './index.css'
import logo from './img/505-blog.png';
import StaredView from './Components/StaredView';

// ========================================


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPostModal: false,
            currentForwardingPost: null,
            currentForwardingId: null,
            currentView: 'main-page', // one of "main-page", "user-post", "followee-post", "private-message", "stared-post"
            appContext: {
                loginStatus: null,
            },
            followeeUsernames: [],
            currentUsername: null,
            viewUsername: null,
            staredPosts: [],
            likedPosts: []
        }

        this.hanldeRequestPost = this.hanldeRequestPost.bind(this);
        this.handlePostModalClosed = this.handlePostModalClosed.bind(this);
        this.handleRequestLogin = this.handleRequestLogin.bind(this);
        this.handleRequestLogout = this.handleRequestLogout.bind(this);
        this.handleSubmitPost = this.handleSubmitPost.bind(this);
        this.handleToggleFollow = this.handleToggleFollow.bind(this);
        this.updateFollowee = this.updateFollowee.bind(this);
        this.updateCurrentUser = this.updateCurrentUser.bind(this);
        this.handleSwitchView = this.handleSwitchView.bind(this);
        this.handleToggleStar = this.handleToggleStar.bind(this);
        this.handleAvatarUploaded = this.handleAvatarUploaded.bind(this);
        this.handleToggleLike = this.handleToggleLike.bind(this);
        this.updateStaredPosts = this.updateStaredPosts.bind(this);
        this.updateLikedPosts = this.updateLikedPosts.bind(this);
    }

    async handleSwitchView(view, viewUsername) {
        this.setState({currentView: view, viewUsername: viewUsername});
    }

    async update() {
        this.setLoginState(
            await requester.isLogined() ? 'logined' : 'not-logined'
        );
        await this.updateFollowee();
        await this.updateCurrentUser();
        await this.updateStaredPosts();
        await this.updateLikedPosts();
    }

    async componentDidMount() {
        await this.update();
        requester.addStaleListener(requester.getFolloweeUsernames, this.updateFollowee);
        requester.addStaleListener(requester.getCurrentUser, this.updateCurrentUser);
        requester.addStaleListener(requester.getStaredPosts, this.updateStaredPosts);
        requester.addStaleListener(requester.getLikedPosts, this.updateLikedPosts);
    }


    hanldeRequestPost(forwardId, forwardElement) {
        this.setState({
            showPostModal: true,
            currentForwardingPost: forwardElement,
            currentForwardingId: forwardId
        });
    }

    handleAvatarUploaded(username) {
        window.location.reload();
    }

    async handleSubmitPost(content, forwardId) {
        try {
            await requester.createPost(content, forwardId);
            this.setState({showPostModal: false});
            requester.setStale(requester.getGeneralMainPage);
        } catch (error) {
            alert(error);
        }
    }

    handlePostModalClosed() {
        this.setState({showPostModal: false});
    }

    async updateFollowee() {
        let followeeUsernames = [];
        try {
            followeeUsernames = await requester.getFolloweeUsernames();
        } catch(error) {
            this.setState({followeeUsernames: []})
            throw error
        }
        this.setState({
            followeeUsernames: followeeUsernames
        })
    }

    async updateCurrentUser() {
        const currentUser = await requester.getCurrentUser();
        this.setState({
            currentUsername: currentUser ? currentUser.username : null
        })
    }

    async handleToggleFollow(username) {
        try {
            if (this.state.followeeUsernames.includes(username)) {
                await requester.unfollow(username);
            } else {
                await requester.follow(username);
            }
            await this.updateFollowee()
        } catch (error) {
            alert(error);
        }
    }
    
    async updateStaredPosts() {
        const staredPosts = await requester.getStaredPosts();
        this.setState({
            staredPosts: staredPosts
        })
    }

    async updateLikedPosts() {
        const likedPosts = await requester.getLikedPosts();
        this.setState({
            likedPosts: likedPosts
        })
    }

    async handleToggleStar(postId, prevStared) {
        try {
            if (prevStared) {
                await requester.unstarPost(postId);
            } else {
                await requester.starPost(postId);
            }
            await this.updateStaredPosts();
        } catch (error) {
            alert(error);
        }
    }

    async handleToggleLike(postId, prevLiked) {
        try {
            if (prevLiked) {
                await requester.unlikePost(postId);
            } else {
                await requester.likePost(postId);
            }
            await this.updateLikedPosts();
        } catch (error) {
            alert(error);
        }
    }

    setLoginState(loginState) {
        const appContext = {...this.state.appContext};
        appContext.loginStatus = loginState;
        this.setState({appContext: appContext});
    }

    async handleRequestLogin(username, password) {
        try {
            this.setLoginState('logining');
            await requester.login(username, password);
            this.setLoginState('logined');
            requester.setStale(requester.isLogined);
            requester.setStale(requester.getCurrentUser);
        } catch (error) {
            this.setLoginState('not-logined');
            alert(error);
        }
        await this.update()
    }

    async handleRequestLogout() {
        try {
            await requester.logout();
            this.setLoginState('not-logined')
        } catch (error) {
            alert(error);
        }
        await this.update()
    }


    render() {
        const currentView = this.state.currentView;
        let innerComponent = null;
        if (['main-page', 'user-post', 'followee-post'].includes(currentView)) {
            innerComponent = (
                <div>
                    <div className="g-mt-30">
                        <ThreeColumnContainer
                            left={
                                <ProfileColum
                                    currentUsername={this.state.currentUsername}
                                    logined={this.state.appContext.loginStatus === 'logined'}
                                    currentView={this.state.currentView}
                                    onRequestLogin={this.handleRequestLogin}
                                    onAvatarUploaded={this.handleAvatarUploaded}
                                    onRequestLogout={this.handleRequestLogout}
                                    onSwitchView={this.handleSwitchView}
                                />}
                            middle={
                                <PostColumn
                                    currentView={this.state.currentView}
                                    currentUsername={this.state.currentUsername}
                                    viewUsername={this.state.viewUsername}
                                    onRequestPost={this.hanldeRequestPost}
                                    onToggleFollow={this.handleToggleFollow}
                                    onToggleStar={this.handleToggleStar}
                                    onToggleLike={this.handleToggleLike}
                                    onSwitchView={this.handleSwitchView}
                                    followeeUsernames={this.state.followeeUsernames}
                                    staredPosts={this.state.staredPosts}
                                    likedPosts={this.state.likedPosts}
                                />}
                            right={
                                <FolloweeColumn
                                    currentView={this.state.currentView}
                                    viewUsername={this.state.viewUsername}
                                    users={this.state.followeeUsernames}
                                    onSwitchView={this.handleSwitchView}
                                />}
                    />
                    </div>
                </div>
            )
        } else if (currentView === 'stared-post') {
            innerComponent = (
                <StaredView
                    logined={this.state.appContext.loginStatus === 'logined'}
                    posts={this.state.staredPosts}
                    currentUsername={this.state.currentUsername}
                    followeeUsernames={this.state.followeeUsernames}
                    onForward={this.hanldeRequestPost}
                    onToggleFollow={this.handleToggleFollow}
                    onToggleStar={this.handleToggleStar}
                    onSwitchView={this.handleSwitchView}
                />
            )
        }

        return (
            <AppContext.Provider value={this.state.appContext}>
                <AppHeader logined={this.state.appContext.loginStatus === 'logined'} currentView={this.state.currentView} onSwitchView={this.handleSwitchView} logoUrl={logo}/>
                {innerComponent}
                <PostModal onSubmitPost={this.handleSubmitPost} forwardId={this.state.currentForwardingId} forwardElement={this.state.currentForwardingPost} show={this.state.showPostModal} onClosed={this.handlePostModalClosed}/>
            </AppContext.Provider>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);