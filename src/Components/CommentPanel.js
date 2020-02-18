import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Comment.css'
import requester from '../Requester';
import { dateDiffNowHumanReadable } from '../util';
import AppContext from '../AppContext';

class CommentPanel extends Component {
    static propTypes = {
        postId: PropTypes.number.isRequired
    }
    
    static contextType = AppContext;
    
    constructor(props) {
        super(props);
        this.initialHeight = 3;
        this.focusHeight = 6;

        this.state = {
            inputHeight: this.initialHeight,
            pageLimit: 10,
            pageNumber: 0,
            comments: [],
            ready: false,
            userCommentContent: '',
            valid: true
        }


        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.update = this.update.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        await this.update();
        requester.addStaleListener(requester.getComments, this.update);
    }

    async componentWillUnmount() {
        requester.removeStaleListener(requester.getComments, this.update);
    }

    async update() {
        try {
            const comments = await requester.getComments(this.props.postId, this.state.pageNumber, this.state.pageLimit);
            this.setState({comments: comments});
        } catch (error) {
            alert(error)
        }

    }

    handleFocus() {
        this.setState({
            inputHeight: this.focusHeight
        });
    }

    handleBlur() {
        setTimeout(() => {
            this.setState({
                inputHeight: this.initialHeight
            }); 
        }, 300);

    }

    handleChange(event) {
        this.setState({
            userCommentContent: event.target.value
        });
        if (event.target.value.length > 139) {
            this.setState({valid: false});
        } else {
            this.setState({valid: true});
        }
    }

    clearInput() {
        this.setState({
            userCommentContent: ''
        });
    }

    async handleComment() {
        try {
            await requester.createComment(this.state.userCommentContent, this.props.postId);
            requester.setStale(requester.getComments);
            this.clearInput();
        } catch (error) {
            alert(error);
        }
    }

    render() {

        const formGroupClassName = "row g-pa-10 form-group g-ml-5" + (!this.state.valid ? ' u-has-error-v1' : '');
        return (
            <div className="d-flex flex-column">

                <div className={formGroupClassName}>
                    <textarea
                        onFocus={this.handleFocus} onBlur={this.handleBlur}
                        className="col-9 form-control form-control-md g-resize-none rounded-0 comment-input"
                        onChange={this.handleChange}
                        value={this.state.userCommentContent}
                        style={{height: this.state.inputHeight + "em"}}
                        placeholder={this.context.loginStatus === 'logined' ? '俺也有想说的！' : '登录以后才可以评论噢🐷'} />
                    <div className="col-3 align-self-center text-right">
                            <button style={{height: this.state.inputHeight + "em"}}
                                disabled={!this.state.valid}
                                className="btn btn-block u-btn-purple u-btn-inset rounded comment-button"
                                onClick={this.handleComment}
                                type="button">评论</button>
                    </div>
                    {!this.state.valid ? <small className="form-control-feedback">字符数不能超过 139 字</small> : null}

                </div>
                <Comments comments={this.state.comments} />
            </div>
        )
    }
}

class Comment extends Component {
    static propTypes = {
        bordered: PropTypes.bool,
        content: PropTypes.string,
        username: PropTypes.string,
        commentId: PropTypes.number,
        date: PropTypes.instanceOf(Date),
    }

    constructor(props) {
        super(props);
        this.state = {
            displayDate: dateDiffNowHumanReadable(this.props.date),
            avatarURL: requester.loadingAvatrURL
        };

        this.updateDate = this.updateDate.bind(this);
    }

    updateDate() {
        this.setState({
            displayDate: dateDiffNowHumanReadable(this.props.date)
        })
    }

    async componentDidMount() {
        this.dateInterval = setInterval(this.updateDate, 1000);
        this.setState({avatarURL: await requester.getAvatarURL(this.props.username)})
    }

    componentWillUnmount() {
        clearInterval(this.dateInterval);
    }

    render() {
        let className = "media g-brd-bottom g-pa-10 g-mb-20 g-brd-purple--hover g-bg-grey--hover";
        if (this.props.bordered) {
            className += " g-brd-gray-light-v4";
        } else {
            className += " g-brd-white"
        }
        return (
            <div className={className}>
                <img className="d-flex g-width-50 g-height-50 rounded-circle g-mt-3 g-mr-15"
                    src={this.state.avatarURL} />
                <div className="media-body">
                    <div className="g-mb-5 d-flex justify-content-between">
                        <span className="g-font-weight-600 g-color-black" style={{'wordBreak': 'break-all'}}>{this.props.username}</span>

                        <span className="g-color-gray-dark-v4 g-font-size-12">{dateDiffNowHumanReadable(this.props.date)}</span>
                    </div>

                    <p>{this.props.content}</p>

                </div>
            </div> 
        )
    }
}


class Comments extends Component {
    render() {
        const comments = this.props.comments.map((value, index) => {
            const bordered = (index !== this.props.comments.length - 1);
            return <Comment key={value.commentId} {...value} bordered={bordered}/>
        });

        return (
            <div className="d-flex flex-column">
                {comments}
            </div>
        )
    }
}

Comments.propTypes = {
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            content: PropTypes.string,
            username: PropTypes.string,
            avatarURL: PropTypes.string,
            commentId: PropTypes.number
        })
    ),
}

export default CommentPanel