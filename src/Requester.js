import { EventEmitter } from "events";

// 页数都从1开始

class Requester extends EventEmitter {
    constructor(baseUrl) {
        super();
        this.baseUrl = baseUrl;
        this.post = this.post.bind(this);
        this.get = this.get.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.isLogined = this.isLogined.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.getGeneralMainPage = this.getGeneralMainPage.bind(this);
        this.createComment = this.createComment.bind(this);
        this.getComments = this.getComments.bind(this);
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.getFolloweeUsernames = this.getFolloweeUsernames.bind(this);
        this.getLastActivityDate = this.getLastActivityDate.bind(this);
        this.getUserPostPage = this.getUserPostPage.bind(this);
        this.getFolloweePostPage = this.getFolloweePostPage.bind(this);
        this.getStaredPosts = this.getStaredPosts.bind(this);
        this.starPost = this.starPost.bind(this);
        this.unstarPost = this.unstarPost.bind(this);
        this.uploadAvatar = this.uploadAvatar.bind(this);
        this.getAvatarURL = this.getAvatarURL.bind(this);
        this.likePost = this.likePost.bind(this);
        this.unlikePost = this.unlikePost.bind(this);
    }

    addStaleListener(requestFunc, callback) {
        this.addListener(requestFunc.name, callback);
    }

    removeStaleListener(requestFunc, callback) {
        this.removeListener(requestFunc.name, callback);
    }

    setStale(requestFunc) {
        this.emit(requestFunc.name);
    }

    async post(path='', data={}) {
        let body = new URLSearchParams();
        for (let key in data) {
            body.append(key, data[key]);
        }

        // Default options are marked with *
        const response = await fetch(this.baseUrl + path, {
            method: 'POST',
            mode: 'cors',
            // cache: 'no-cache',
            credentials: 'include',
            headers: {
                //   'Content-Type': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: body,
        });
        return response.json();
    }

    async get(path='') {
        const response = await fetch(this.baseUrl + path, {
            method: 'GET',
            mode: 'cors',
            // cache: 'no-cache',
            credentials: 'include',
            headers: {

            },
            redirect: 'follow',
            referrer: 'no-referrer',
        });
        return response.json(); // parses JSON response into native Javascript objects
    }

    async login(username, password) {
        const result = await this.post('usr/login', {'用户名': username, '密码': password});
        if ('error' in result) {
            throw result.error;
        }
    }

    async logout() {
        const result = await this.get('usr/logout');
        if ('error' in result) {
            throw result.error;
        }
    }


    async register(username, password, email) {
        const result = await this.post('usr/register', {'用户名': username, '密码': password, '密码验证': password, '邮箱': email});
        if ('error' in result) {
            throw result.error;
        }
    }

    async isLogined() {
        const response = await this.get('usr/current');
        return !('error' in response);
    }

    async getCurrentUser() {
        const response = await this.get('usr/current');
        if ('error' in response) {
            return null;
        } else {
            return {
                username: response.usr.usrname,
                email: response.usr.email
            }
        }
    }

    convertPost(postJson) {
        return {
            content: postJson.content,
            username: postJson.uid,
            postId: postJson.ID,
            forwardId: postJson.former_id,
            likeNumber: postJson.like_num,
            commentNumber: postJson.comment_num,
            starNumber: postJson.mark_num,
            forwardNumber: postJson.forward_num,
            date: new Date(postJson.time * 1000)
        }
    }

    async getGeneralMainPage(pageNumber, limit=10) {
        const response = await this.get(`post/mainpage/${pageNumber}`);
        const posts = response.posts.map((postJson) => {
            return this.convertPost(postJson);
        });
        const totalPageNumber = response.total_page;
        return {
            posts: posts,
            totalPageNumber: totalPageNumber
        }
    }

    async getFolloweePostPage(pageNumber, limit=10) {
        const result = await this.get(`post/focus_usr/${pageNumber}`);
        if ('error' in result) {
            throw result.error
        }
        const posts = result.posts.map((postJson) => {
            return this.convertPost(postJson);
        });
        const totalPageNumber = result.total_page;
        return {
            posts: posts,
            totalPageNumber: totalPageNumber
        }
    }

    async getStaredPosts() {
        return (await this.get(`post/mark_post`)).posts.map((postJson) => {
            return this.convertPost(postJson);
        })
    }

    async starPost(postId) {
        const result = await this.post('post/mark', {post_id: postId});
        if ('error' in result) {
            throw result.error;
        }
    }

    async unstarPost(postId) {
        const result = await this.post('post/unmark', {post_id: postId});
        if ('error' in result) {
            throw result.error;
        }
    }

    async getLikedPosts() {
        return (await this.get(`post/liked_posts`)).posts.map((postJson) => {
            return this.convertPost(postJson);
        })
    }

    async likePost(postId) {
        const result = await this.post('post/like', {'post_id': postId});
        if ('error' in result) {
            throw result.error
        }
    }

    async unlikePost(postId) {
        const result = await this.post('post/unlike', {'post_id': postId});
        if ('error' in result) {
            throw result.error
        }
    }

    async getUserPostPage(username, pageNumber, limit=10) {
        const params = new URLSearchParams();
        params.append('usrname', username);
        const response = await this.get(`post/usr_post/${pageNumber}?${params}`);
        const posts = response.posts.map((postJson) => {
            return this.convertPost(postJson);
        });
        const totalPageNumber = response.total_page;
        return {
            posts: posts,
            totalPageNumber: totalPageNumber
        }
    }

    async getPost(postId) {
        const result = await this.get(`post/${postId}`);
        if ('error' in result) {
            throw result.error
        }
        return this.convertPost(result.post);
    }

    async createPost(content, forwardId) {
        let result = null;
        if (forwardId === null) {
            result = await this.post('post/create_post', {'内容': content});
        } else {
            result = await this.post('post/forward', {'post_id': forwardId, '转发评论': content});
        }

        if ('error' in result) {
            throw result.error
        }
    }

    async createComment(content, postId) {
        const result = await this.post('post/comment', {'comment': content, 'post_id': postId});
        if ('error' in result) {
            throw result.error
        }
    }

    async getComments(postId, pageNumber, limit) {
        if (typeof limit === 'undefined') {
            limit = 10;
        }
        const result = await this.get(`post/${postId}/comment/?page=${pageNumber}&limit=${limit}`);
        if ('error' in result) {
            throw result.error
        }
        return result.comments.map((commentJson) => {
            return {
                postId: commentJson.bid,
                content: commentJson.comment,
                commentId: commentJson.cid,
                username: commentJson.uid,
                date: new Date(commentJson.time * 1000)
            }
        })
    }

    async follow(username) {
        const result = await this.post('post/follow', {'follow_usrname': username});
        if ('error' in result) {
            throw result.error
        }
    }

    async unfollow(username) {
        const result = await this.post('post/unfollow', {'unfollow_usrname': username});
        if ('error' in result) {
            throw result.error
        }
    }

    async getFolloweeUsernames() {
        const result = await this.get('post/focus_usr_list');
        if ('error' in result)  {
            throw result.error;
        }
        return result.usrs;
    }

    async getLastActivityDate(username) {
        const result = await this.post(`usr/last_activity`, {'uid': username});
        if ('error' in result) {
            throw result.error;
        }
        return new Date(result.time * 1000);
    }

    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('usrfile', file);
        const result = await fetch(this.baseUrl + 'usr/upload_avatar' ,{ 
            method :"POST",
            body: formData,
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            referrer: 'no-referrer'
 
        })
        const json = await result.json();
        if ('error' in json) {
            throw json.error;
        }
        // console.log(await result.text())
    }

    async getAvatarURL(username) {
        const response = await fetch(this.baseUrl + `avatars/${username}.jpg`);
        if (response.status === 404) {
            return this.defaultAvatarURL;
        } else {
            return this.baseUrl + `avatars/${username}.jpg`;
        }
    }

    get defaultAvatarURL() {
        return this.baseUrl + 'avatars/default/default.jpg';
    }

    get loadingAvatrURL() {
        return this.baseUrl + 'avatars/default/loading.gif'
    }

}

// const requester = new Requester('/blog/');
const requester = new Requester('http://localhost:8000/');


export default requester
