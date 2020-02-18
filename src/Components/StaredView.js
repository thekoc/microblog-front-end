import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Post } from './Post';
import Masonry from 'react-masonry-component';
import './Stared.css'


class StaredView extends Component {
    static propTypes = {
        posts: PropTypes.array,
        currentUsername: PropTypes.string,
        followeeUsernames: PropTypes.arrayOf(PropTypes.string).isRequired,
        onToggleFollow: PropTypes.func,
        onToggleStar: PropTypes.func.isRequired,
        onSwitchView: PropTypes.func.isRequired,
        onRequestPost: PropTypes.func
    }
    
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1
        }

        this.update = this.update.bind(this);
    }

    async componentDidMount() {
        // await this.update();
        // requester.addStaleListener(requester.getGeneralMainPagePosts, this.update);
    }

    async update() {
        // const posts = await requester.getGeneralMainPagePosts(this.state.pageNumber);
        // this.setState({posts: posts});
    }

    render() {
        return (
            <Masonry
                className={'my-gallery-class g-mt-20 g-ml-50'} // default ''
                elementType={'div'} // default 'div'
                options={{}} // default {}
                disableImagesLoaded={false} // default false
                updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
                imagesLoadedOptions={{}} // default {}
            >
                {this.props.posts.length === 0 ? 
                        <div className="alert alert-info alert-dismissible fade show" role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <p>看起来你没有收藏❤️任何微博</p>
                        <p>收藏❤️一些微博试试🦄️？</p>
                        </div>
                    :null
                }
                {
                    this.props.posts.map((post) => {
                        return (
                            <div key={post.postId} className={'stared-post g-ma-10'}>
                                <div className="card-header g-bg-gray-light-v3 rounded g-brd-around"
                                    style={{
                                        display: 'flex', justifyContent: 'flex-end',
                                        paddingTop: '0px',
                                        paddingBottom: '2px',
                                        paddingRight: '6px'
                                    }}
                                >
                                    <span onClick={() => this.props.onToggleStar(post.postId, true)}>×</span>
                                </div>
                                <Post
                                    quoteLevel={0}
                                    showOperation={false}
                                    post={post}
                                    showForward={false}
                                    staredPosts={this.props.posts}
                                    currentUsername={this.props.currentUsername}
                                    onForward={this.props.onRequestPost}
                                    onToggleFollow={this.props.onToggleFollow}
                                    onSwitchView={this.props.onSwitchView}
                                    followeeUsernames={this.props.followeeUsernames}
                                />
                            </div>

                        )
                    })
                }
            </Masonry>
        )
    }
}


export default StaredView