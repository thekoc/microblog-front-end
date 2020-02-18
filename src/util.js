import requester from "./Requester";

export function dateDiffNowHumanReadable(date) {
    const nowTimestamp = new Date().getTime();
    const timeDiff = (nowTimestamp - date) / 1000;
    let suffix = undefined;
    if (timeDiff > 0) {
        suffix = 'ago';
    } else if (timeDiff < 0) {
        suffix = 'after'
    } else {
        return 'now';
    }

    const timeDiffAbs = Math.abs(timeDiff);
    const dayDiff = Math.round(timeDiffAbs / (24 * 60 * 60));
    const hourDiff = Math.round((timeDiffAbs % (24 * 60 * 60)) / 3600);
    const minuteDiff = Math.round((timeDiffAbs % (24 * 60)) / 60);
    const secondsDiff = Math.round(timeDiffAbs % 60);
    
    let result = '';
    if (dayDiff > 0) {
        result += `${dayDiff}d `
    } else if (hourDiff > 0) {
        result += `${hourDiff}h ${minuteDiff}m `
    } else if (minuteDiff > 0) {
        result += `${minuteDiff}m `
    } else if (secondsDiff > 0) {
        result += `${secondsDiff}s `
    } else {
        return 'now'
    }

    return result + suffix;
}

export function getPostIndex(posts, postId) {
    return posts.findIndex((post) => post.postId === postId);
}

/**
 * Load the forward post in place
 * @param {object} post the post returned from requester
 * @param {number} maxDepth 
 */
export async function loadForwardPost(post, maxDepth=3) {
    if (maxDepth <= 0) {
        return;
    }
    if (post.forwardId !== null) {
        const forwarded = await requester.getPost(post.forwardId);
        await loadForwardPost(forwarded, maxDepth - 1);
        post.forwardedPost = forwarded;
    }
}

/**
 * Load the forward posts in place
 * @param {Array} post the post returned from requester
 * @param {number} maxDepth 
 */
export async function loadForwardPosts(posts, maxDepth=3) {
    return Promise.all(posts.map((post) => loadForwardPost(post, maxDepth)));
}


export function getTags(s) {
	const tagRE = /(#[^ ]* )*#[^ ]*$/g;

	let result = s.match(tagRE);
	if (result && result.length > 0) {
        return result[0].split(' ').map((tagWithSharp) => tagWithSharp.slice(1));
	} else {
        return [];
	}
}

export function getStringWithoutTags(s) {
	const tagRE = /(#[^ ]* )*#[^ ]*$/g;
	return s.replace(tagRE, '');
}
