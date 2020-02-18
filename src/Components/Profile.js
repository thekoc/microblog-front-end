import React, { Component } from 'react'
import PropTypes from 'prop-types';
import requester from '../Requester';


class Profile extends Component {
    static propTypes = {
        username: PropTypes.string,
        email: PropTypes.string,
        onSwitchView: PropTypes.func,
        onAvatarUploaded: PropTypes.func
    }
    
    constructor(props) {
        super(props);
        this.state = {
            avatarURL: requester.loadingAvatrURL
        }
        
        this.onAvatarFileInputChange = this.onAvatarFileInputChange.bind(this);
        this.imageFileInput = React.createRef();
    }

    async onAvatarFileInputChange(e){
        const file = e.target.files[0];
        // if(file) dispatch({ type:'upload', file })
        try {
            await requester.uploadAvatar(file);

        } catch (error) {
            alert(error)
        }
        this.props.onAvatarUploaded(this.props.username);
        // e.target.value = '' // 上传之后还原
    }

    async componentDidMount() {
        if (this.props.username !== null) {
            const avatarURL = await requester.getAvatarURL(this.props.username);
            this.setState({avatarURL: avatarURL})
        } else {
            this.setState({avatarURL: requester.loadingAvatrURL})
        }
    }

    // eslint-disable-next-line no-unused-vars
    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.username !== this.props.username) {
            const avatarURL = await requester.getAvatarURL(this.props.username);
            this.setState({avatarURL: avatarURL})
        }
    }

    render() {
        return (
            <figure className="g-bg-white g-brd-around g-brd-gray-light-v4 g-brd-blue--hover g-transition-0_2 text-center">
                <div className="g-py-40 g-px-10">
                    {/* <!-- Figure Image --> */}
                    <img className="g-width-150 g-height-150 rounded-circle g-mb-10 avatar" src={this.state.avatarURL}
                        alt="Image Description" />
                    {/* <!-- Figure Image --> */}
                    <input type="file" name="usrfile" onChange={this.onAvatarFileInputChange} style={{display:'none'}} ref={this.imageFileInput}/>
                    <div><a href="#!" onClick={() => this.imageFileInput.current.click()}>修改头像</a></div>
                    {/* <!-- Figure Info --> */}
                    <a href={'#' + this.props.username} onClick={() => this.props.onSwitchView('user-post', this.props.username)}><h4 className="h5 g-mb-5">{this.props.username}</h4></a>
                    <div className="d-block">
                        <span className="g-color-cyan g-font-size-default g-mr-3">
                            <i className="icon-notebook"></i>
                        </span>
                        <em className="g-color-gray-dark-v4 g-font-style-normal g-font-size-default">{this.props.email}</em>
                    </div>
                    {/* <!-- End Figure Info --> */}
                </div>

                <hr className="g-brd-gray-light-v4 g-my-0" />

                {/* <!-- Figure List --> */}
                {/* <ul className="row list-inline g-py-20 g-ma-0">
                    <li className="col g-brd-right g-brd-gray-light-v4">
                        <a className="u-icon-v1 u-icon-size--sm g-color-gray-dark-v5 g-bg-transparent g-color-red--hover">
                            <i className="fa fa-heart-o"></i>
                        </a>
                    </li>
                    <li className="col g-brd-right g-brd-gray-light-v4">
                        <a className="u-icon-v1 u-icon-size--sm g-color-gray-dark-v5 g-bg-transparent g-color-blue--hover">
                            <i className="icon-envelope"></i>
                        </a>
                    </li>
                    <li className="col">
                        <a className="u-icon-v1 u-icon-size--sm g-color-gray-dark-v5 g-bg-transparent g-color-purple--hover">
                            <i className="icon-settings"></i>
                        </a>
                    </li>
                </ul> */}
                {/* <!-- End Figure List --> */}
            </figure> 
        )
    }
}



export default Profile
