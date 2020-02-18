import React, { Component } from 'react'
import PropTypes from 'prop-types';

import Accordion from './Accordion'
import CommentPanel from './CommentPanel'

import {dateDiffNowHumanReadable, getTags, getStringWithoutTags} from '../util'
import SpningButton from './SpinningButton';
import AppContext from '../AppContext';
import requester from '../Requester';

class PostOperation extends Component {
    static propTypes = {
        liked: PropTypes.bool,
        stared: PropTypes.bool,
        likeNumber: PropTypes.number,
        starNumber: PropTypes.number,
        forwordNumber: PropTypes.number,
        onForwardClick: PropTypes.func,
        onToggleStarClick: PropTypes.func,
        onToggleLikeClick: PropTypes.func,
        onComment: PropTypes.func,
        showComment: PropTypes.bool,
        postId: PropTypes.number.isRequired
    }


    constructor(props) {
        super(props);
        this.state = {
            commentCollapsed: false,
        }

        this.handleComment = this.handleComment.bind(this);
    }

    handleComment() {
        this.setState({
            commentCollapsed: !this.state.commentCollapsed
        })
    }

    render() {
        let starClass = `fa ${this.props.stared ? "fa-heart g-color-red" : "fa-heart-o"} g-pos-rel g-top-1 g-mr-3`;
        let likeClass = `fa ${this.props.liked ? "fa-thumbs-up g-color-cyan" : "fa-thumbs-o-up"} g-pos-rel g-top-1 g-mr-3`;

        return (
            <div className="d-flex flex-column">
                <ul className="list-inline mb-0">
                    <li className="list-inline-item g-mr-20">
                        <a onClick={this.props.onForwardClick} className="u-link-v5 g-color-gray-dark-v5 g-color-blue--hover">
                            <i className="icon-action-redo g-pos-rel g-top-1 g-mr-3"></i>{this.props.forwordNumber}
                        </a>
                    </li>
                    <li className="list-inline-item g-mr-20">
                        <a onClick={this.props.onToggleStarClick} className="u-link-v5 g-color-gray-dark-v5 g-color-red--hover">
                            <i className={starClass}></i>{this.props.starNumber}
                        </a>
                    </li>
                    <li className="list-inline-item g-mr-20">
                        <a onClick={this.props.onToggleLikeClick} className="u-link-v5 g-color-gray-dark-v5 g-color-green--hover">
                            <i className={likeClass}></i>{this.props.likeNumber}
                        </a>
                    </li>
                    {this.props.showComment ?
                        <li className="list-inline-item g-mr-20">
                            <a onClick={this.handleComment} className="u-link-v5 g-color-gray-dark-v5 g-color-purple--hover">
                                <i className="icon-bubble g-pos-rel g-top-1 g-mr-3"></i>
                            </a>
                        </li>
                        : null
                    }

                </ul>
                <Accordion collapsed={this.state.commentCollapsed}>
                    <CommentPanel postId={this.props.postId}/>
                </Accordion>
            </div>
        )
    }
}

export class Post extends Component {
    static contextType = AppContext;

    static propTypes = {
        quoteLevel: PropTypes.number,
        showOperation: PropTypes.bool,
        padding: PropTypes.string,
        post: PropTypes.shape({
            postId: PropTypes.number,
            username: PropTypes.string,
            date: PropTypes.instanceOf(Date),
            content: PropTypes.string,
            forwardId: PropTypes.number,
            likeNumber:  PropTypes.number,
            forwardNumber: PropTypes.number,
            starNumber: PropTypes.number,
            commentNumber: PropTypes.number,
            forwardedPost: PropTypes.object
        }),
        showForward: PropTypes.bool,
        showComment: PropTypes.bool,
        currentUsername: PropTypes.string,
        onForward: PropTypes.func, // args: (postId: number, postElement: reactElement)
        onToggleFollow: PropTypes.func,
        onToggleStar: PropTypes.func,
        onToggleLike: PropTypes.func,
        onSwitchView: PropTypes.func.isRequired,
        followeeUsernames: PropTypes.arrayOf(String).isRequired,
        staredPosts: PropTypes.array.isRequired,
        likedPosts: PropTypes.array
    }

    static defaultProps = {
        quoteLevel: 0,
        showComment: true
    }

    constructor(props) {
        super(props);

        this.state = {
            liked: false,
            starNumber: 0,
            starOffset: 0,
            prevStared: null,
            likeNumebr: 0,
            maxQuoteLevel: 2,
            avatarURL: requester.loadingAvatrURL
        }
    }

    async componentDidMount() {
        const avatarURL = await requester.getAvatarURL(this.props.post.username);
        this.setState({avatarURL: avatarURL});
    }

    get stared() {
        return (this.props.staredPosts.findIndex((post) => post.postId === this.props.post.postId) !== -1);
    }

    get liked() {
        return (this.props.likedPosts.findIndex((post) => post.postId === this.props.post.postId) !== -1);
    }

    renderCustom(quoteLevel, showOperation, showForward) {
        let className= `post-505 g-brd-around g-brd-gray-light-v4 g-brd-left-3 g-brd-blue-left rounded g-mb-10 g-brd-blue--hover g-transition-0_3 d-flex flex-column`;
        if (quoteLevel > 0) {
            const marginLeft = ` g-ml-${Math.round(quoteLevel * 0)}`;
            className += marginLeft;
        }
        const rawContent = this.props.post.content;
        const tags = getTags(rawContent);
        const cleanContent = getStringWithoutTags(rawContent);
        const followed = this.props.followeeUsernames.includes(this.props.post.username);
        const showFollowButton = this.props.currentUsername && this.props.currentUsername !== this.props.post.username;
        const followButton = followed ?
                                (<SpningButton
                                    className="btn btn-sm u-btn-blue g-ml-10 g-rounded-50 g-font-size-9"
                                    onClick={() => this.props.onToggleFollow(this.props.post.username)}>
                                    已关注
                                </SpningButton>)
                                : (<SpningButton
                                            className="btn btn-sm u-btn-outline-blue g-ml-10 g-rounded-50 g-font-size-9"
                                            onClick={() => this.props.onToggleFollow(this.props.post.username)}>
                                            关注
                                    </SpningButton>)
        return (
            <div className="d-flex flex-column">
                <div className={className} style={{padding: '4%'}}>
                    <div className="d-flex">
                        <div className="d-flex g-mt-2 g-mr-15">
                            <img className="avatar g-width-50 g-height-50 rounded-circle mCS_img_loaded" src={this.state.avatarURL} alt="Image Description" />
                        </div>
                        <div className="media-body">
                            <div className="d-flex justify-content-between">
                                <span>
                                    <a href={'#' + this.props.post.username} onClick={() => this.props.onSwitchView('user-post', this.props.post.username)} className="g-font-weight-600 g-color-black" style={{'wordBreak': 'break-all'}}>{this.props.post.username}</a>

                                    {showFollowButton ? followButton : null}
                                </span>
                                <span className="small text-nowrap g-color-blue">{dateDiffNowHumanReadable(this.props.post.date)}</span>
                            </div>
                            <p>{cleanContent}</p>

                            <Tags tags={tags}></Tags>
                            {showForward && this.props.post.forwardedPost && this.props.quoteLevel < this.state.maxQuoteLevel ?
                                <Post
                                    {...this.props}
                                    post={this.props.post.forwardedPost} showComment={false} quoteLevel={this.props.quoteLevel + 1} showForward={showForward} />
                                : null}
                            {showOperation ? (
                                <div>
                                    <hr className="g-my-5"/>
                                    <PostOperation
                                        postId={this.props.post.postId}
                                        onForwardClick={() => this.props.onForward(this.props.post.postId, this.renderCustom(1, false, false))}
                                        onToggleStarClick={() => this.props.onToggleStar(this.props.post.postId, this.stared)}
                                        onToggleLikeClick={() => this.props.onToggleLike(this.props.post.postId, this.liked)}
                                        onComment={this.handleComment}
                                        showComment={this.props.showComment}
                                        liked={this.liked}
                                        stared={this.stared}
                                        likeNumber={this.props.post.likeNumber}
                                        starNumber={this.props.post.starNumber + this.state.starOffset}
                                        forwordNumber={this.props.post.forwardNumber}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return this.renderCustom(this.props.quoteLevel, this.props.showOperation, this.props.showForward);
    }
}

function Tag(props) {
    // <span class="u-label u-label--sm g-bg-teal g-rounded-20 g-px-10">Ruby</span>
    return <span className="u-label g-bg-gray-light-v4 g-color-main g-rounded-20 g-mr-5 g-mb-15">{props.tag}</span>
}

Tag.propTypes = {
    tag: PropTypes.string
}

function Tags(props) {
    const tags = props.tags.map((tag) => <Tag key={tag} tag={tag} />);
    return <div>{tags}</div>
}

Tags.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string)
}

export default Post
