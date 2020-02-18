import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Post from './Post'
import requester from '../Requester'
import AppContext from '../AppContext'
import { loadForwardPosts } from '../util';
import Pagination from './Pagination';


function postAmountStateSetterMaker(updatedPostId, prevStatus, amountName) {
    // eslint-disable-next-line no-unused-vars
    return function postAmountStateSetter(state, props) {
        function updatePostsAmount(posts, updatedPostId, prevStatus, amountName) {
            for (let post of posts) {
                if (post.postId === updatedPostId) {
                    post[amountName] = post[amountName] + (prevStatus ? -1 : 1);
                }
                if (typeof post.forwardedPost !== 'undefined') {
                    updatePostsAmount([post.forwardedPost], updatedPostId, prevStatus, amountName);
                }
            }
        }
        const posts = state.posts;
        updatePostsAmount(posts, updatedPostId, prevStatus, amountName);
        return {
            posts: posts
        }

    }
}



class MainPagePosts extends Component {
    static propTypes = {
        postProps: PropTypes.object,
    }

    static defaultProps = {
        followeeUsernames: []
    }

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            totalPageNumber: null,
            pageNumber: 1
        };
        this.update = this.update.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    
    async componentDidMount() {
        await this.update();

        requester.addStaleListener(requester.getGeneralMainPage, this.update);
        this.updateInterval = setInterval(this.update, 3000);
    }

    componentWillUnmount() {
        requester.removeStaleListener(requester.getGeneralMainPage, this.update);
        clearInterval(this.updateInterval);
    }

    async update() {
        const mainPage = await requester.getGeneralMainPage(this.state.pageNumber);
        const posts = mainPage.posts;
        const totalPageNumber = mainPage.totalPageNumber;
        await loadForwardPosts(posts);
        this.setState({posts: posts, totalPageNumber: totalPageNumber})
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.pageNumber !== this.state.pageNumber) {
            await this.update();
        }
    }

    async handlePageChange(pageNumber) {
        this.setState({pageNumber: pageNumber});
    }

    render() {
        return (
            <div>
                {this.state.posts.map((post) => {
                    return (
                        <Post key={post.postId}
                            {...this.props.postProps}
                            post={post}
                            showForward={true}
                            showOperation={true}
                            onToggleStar={async (postId, prevStatus) => {
                                await this.props.postProps.onToggleStar(postId, prevStatus);
                                await this.update();
                            }}
                            onToggleLike={async (postId, prevStatus) => {
                                await this.props.postProps.onToggleLike(postId, prevStatus);
                                await this.update();
                            }}
                        />
                    )
                })}
                <Pagination currentPageNumber={this.state.pageNumber} totalPageNumber={this.state.totalPageNumber} onPageChange={this.handlePageChange} />
            </div>

        )
    }
}

class UserPosts extends Component {
    static propTypes = {
        postProps: PropTypes.object,
        viewUsername: PropTypes.string
    }
    
    static defaultProps = {
        followeeUsernames: []
    }

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            prevViewUsername: props.viewUsername,
            needsUpdatePosts: false,
            pageNumber: 1,
            totalPageNumber: null
        };
        this.update = this.update.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    

    static getDerivedStateFromProps(props, state) {
        if (props.viewUsername !== state.prevViewUsername) {
            return {
                prevViewUsername: props.viewUsername,
                needsUpdatePosts: true,
                pageNumber: 1
            };
        }
        return null;
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.needsUpdatePosts) {
            this.setState({needsUpdatePosts: false});
            await this.update();
        }
        if (prevState.pageNumber !== this.state.pageNumber) {
            await this.update();
        }
    }


    async componentDidMount() {
        await this.update();
        requester.addStaleListener(requester.getUserPostPage, this.update);
        this.updateInterval = setInterval(this.update, 2000);
    }

    async componentWillUnmount() {
        requester.removeStaleListener(requester.getUserPostPage, this.update);
        clearInterval(this.updateInterval);
    }

    async update() {
        const result = await requester.getUserPostPage(this.props.viewUsername, this.state.pageNumber);
        const posts = result.posts;
        const totalPageNumber = result.totalPageNumber;
        await loadForwardPosts(posts);
        this.setState({posts: posts, totalPageNumber: totalPageNumber});
    }

    async handlePageChange(pageNumber) {
        this.setState({pageNumber: pageNumber});
    }

    render() {
        return (
            <div>
                {
                    this.state.posts.map((post) => {
                        return (
                            <Post key={post.postId}
                                {...this.props.postProps}
                                post={post}
                                showForward={true}
                                showOperation={true}
                                onToggleStar={async (postId, prevStatus) => {
                                    await this.props.postProps.onToggleStar(postId, prevStatus);
                                    await this.update();
                                }}
                                onToggleLike={async (postId, prevStatus) => {
                                    await this.props.postProps.onToggleLike(postId, prevStatus);
                                    await this.update();
                                }}        
                            />
                        )
                    })
                }
                <Pagination currentPageNumber={this.state.pageNumber} totalPageNumber={this.state.totalPageNumber} onPageChange={this.handlePageChange} />
            </div>

        )
    }
}

class FolloweePosts extends Component {
    static propTypes = {
        currentUsername: PropTypes.string,
        pageNumer: PropTypes.number.isRequired,
        followeeUsernames: PropTypes.arrayOf(PropTypes.string),
        postProps: PropTypes.object
    }

    static defaultProps = {
        followeeUsernames: []
    }

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            prevFolloweeUsernames: [],
            needsUpdatePosts: false,
            totalPageNumber: null,
            pageNumber: 1
        };
        this.update = this.update.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.followeeUsernames.sort()) !== JSON.stringify(state.prevFolloweeUsernames.sort())) {
            return {
                prevFolloweeUsernames: props.followeeUsernames,
                needsUpdatePosts: true,
                pageNumber: 1
            }
        } else {
            return null;
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.needsUpdatePosts) {
            await this.update();
            this.setState({needsUpdatePosts: false})
        }
        if (prevState.pageNumber !== this.state.pageNumber) {
            await this.update();
        }
    }

    async componentDidMount() {
        await this.update();
        requester.addStaleListener(requester.getFolloweePostPage, this.update);
        this.updateInterval = setInterval(this.update, 2000);
    }

    componentWillUnmount() {
        requester.removeStaleListener(requester.getFolloweePostPage, this.update);
        clearInterval(this.updateInterval);
    }

    async update() {
        try {
            const result = await requester.getFolloweePostPage(this.state.pageNumber);
            const posts = result.posts;
            await loadForwardPosts(posts);
            const totalPageNumber = result.totalPageNumber;
            this.setState({posts: posts, totalPageNumber: totalPageNumber})
        } catch (error) {
            alert(error);
        }
    }

    async handlePageChange(pageNumber) {
        this.setState({pageNumber: pageNumber})
    }

    render() {
        return (
            <div>
                {this.state.posts.length === 0 ? 
                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <p>看起来你没有关注任何用户</p>
                    <p>关注一些用户试试🤔️？</p>
                    </div>
                    :null
                }
                {this.state.posts.map((post) => {
                    return (
                        <Post key={post.postId}
                            {...this.props.postProps}
                            post={post}
                            showForward={true}
                            showOperation={true}
                            onToggleStar={async (postId, prevStatus) => {
                                await this.props.postProps.onToggleStar(postId, prevStatus);
                                await this.update();
                            }}
                            onToggleLike={async (postId, prevStatus) => {
                                await this.props.postProps.onToggleLike(postId, prevStatus);
                                await this.update();
                            }}          
                        />
                    )
                })}
                <Pagination currentPageNumber={this.state.pageNumber} totalPageNumber={this.state.totalPageNumber} onPageChange={this.handlePageChange} />
            </div>

        )
    }
}


class PostColumn extends Component {
    static propTypes = {
        onRequestPost: PropTypes.func, // args: (postId: number, postElement: reactElement),
        currentView: PropTypes.string,
        currentUsername: PropTypes.string,
        viewUsername: PropTypes.string,
        followeeUsernames: PropTypes.array,
        onToggleStar: PropTypes.func,
        onToggleLike: PropTypes.func,
        onToggleFollow: PropTypes.func,
        onSwitchView: PropTypes.func.isRequired,
        staredPosts: PropTypes.array.isRequired,
        likedPosts: PropTypes.array.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loaded: false,
            pageNumer: 1 // TODO: change page number
        }
    }

    render() {
        const currentView = this.props.currentView;
        let postsElement = null;
        const postProps={
            onSwitchView: this.props.onSwitchView,
            followeeUsernames: this.props.followeeUsernames,
            currentUsername: this.props.currentUsername,
            onForward: this.props.onRequestPost,
            onToggleFollow: this.props.onToggleFollow,
            onToggleStar: this.props.onToggleStar,
            onToggleLike: this.props.onToggleLike,
            staredPosts: this.props.staredPosts,
            likedPosts: this.props.likedPosts
        };
        let showPostButton = true;
        if (currentView === 'main-page') {
            showPostButton = true;
            postsElement = (
                <MainPagePosts
                    onToggleStar={this.props.onToggleStar}
                    onToggleLike={this.props.onToggleLike}
                    postProps={postProps}
                    pageNumer={this.state.pageNumer}
                />
            );
        } else if (currentView === 'user-post') {
            showPostButton = false;
            postsElement = (
                <UserPosts
                    viewUsername={this.props.viewUsername}
                    onToggleStar={this.props.onToggleStar}
                    onToggleLike={this.props.onToggleLike}
                    postProps={postProps}
                    pageNumer={this.state.pageNumer}/>
            )
        } else if (currentView === 'followee-post') {
            showPostButton = true;
            postsElement = (
                <FolloweePosts
                    onToggleStar={this.props.onToggleStar}
                    onToggleLike={this.props.onToggleLike}
                    postProps={postProps}
                    followeeUsernames={this.props.followeeUsernames}
                    pageNumer={this.state.pageNumer}/>
            )
        }

        return (
            <div className="d-flex flex-column">
                {showPostButton ?
                    <button 
                        onClick={() => this.props.onRequestPost(null, null)}
                        className="btn btn btn-lg u-btn-outline-blue g-rounded-30 g-mr-10 g-mb-15">
                        发送微博
                    </button>
                    : null
                }
                {this.props.viewUsername ?
                    <div className="u-heading-v2-3--top g-mb10">
                        <h2 className="u-heading-v2__title g-font-weight-500">{this.props.viewUsername}的微博</h2>
                    </div>
                    : null
                }

                {postsElement}
            </div>
        )
    }
}


PostColumn.contextType = AppContext;


export default PostColumn