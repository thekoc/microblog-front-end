import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from './Modal'

class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            valid: true
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
        if (name === 'content') {
            if (value.length > 140) {
                this.setState({valid: false});
            } else {
                this.setState({valid: true});
            }
        }
    }
    
    render() {
        const formGroupClassName = 'row g-pa-10 form-group g-mb-0' + (!this.state.valid ? ' u-has-error-v1' : '');
        return (
            <form className="">
                <div className={formGroupClassName}>
                    <textarea name="content" value={this.state.content} onChange={this.handleInputChange} className="col-10 form-control form-control-md g-resize-none rounded-0" style={{height: "8rem"}} placeholder="大胆去说！"></textarea>
                    <div className="col-2 align-self-center text-right">
                            <button style={{height: "8rem", minWidth: "fit-content"}}
                                className="btn btn-block u-btn-primary rounded" disabled={!this.state.valid}
                                onClick={() => {
                                    this.setState({content: ''})
                                    this.props.onSubmit(this.state.content);
                                }}
                                type="button">发送</button>
                    </div>
                    {!this.state.valid ? <small className="form-control-feedback">字符数不能超过 140 字</small> : null}

                </div>
                <small className="form-text text-muted g-font-size-default g-mb-20">
                    <strong>注意:</strong> 也请遵循相关的法律法规，不要搞太大胆了。
                </small>

            </form>
        )
    }
}

PostForm.propTypes = {
    onSubmit: PropTypes.func
}

class PostModal extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        onClosed: PropTypes.func,
        onSubmitPost: PropTypes.func.isRequired,
        forwardElement: PropTypes.element,
        forwardId: PropTypes.number
    }
    
    constructor(props) {
        super(props);
    }

    render() {
        const title = this.props.forwardId ? "转发微博" : "发送新微博";
        return (
            <Modal show={this.props.show} onClosed={this.props.onClosed}>
                <div className="u-heading-v2-4--bottom g-mb-40">
                    <h2 className="text-uppercase u-heading-v2__title g-mb-10">{title}</h2>
                </div>
                <PostForm onSubmit={(content) => this.props.onSubmitPost(content, this.props.forwardId)}/>
                {this.props.forwardElement}
            </Modal>
        )
    }
}




export default PostModal