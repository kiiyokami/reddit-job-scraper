const axios = require('axios');
const luxon = require('luxon');
const { subreddits, title_keywords, description_keywords } = require('../../config.json');

const jsonHandler = async (link: string) => {
    const response = await axios.get(link);
    const data = parser(response.data);
    return data;
}

const parser = (data: any) => {
    const posts = data.data.children.map((post: any) => {
        return {
            title: post.data.title,
            description: post.data.selftext,
            url: post.data.url,
            created: post.data.created_utc,
        }
    });
    return filter(posts);
}

const filter = (posts: any) => {
    const filtered_posts = posts.filter((post: any) => {
        return title_keywords.some((keyword: string) => post.title.toLowerCase().includes(keyword))
            && description_keywords.some((keyword: string) => post.description.toLowerCase().includes(keyword))
            && luxon.DateTime.fromMillis(post.created * 1000) > luxon.DateTime.now().minus({ hours: 7 })
    });
    return filtered_posts;
}

export const batchFetcher = async () => {
    const links = subreddits.map((thread: string) => new URL(`https://www.reddit.com/r/${thread}/new.json?limit=25`));
    const responses = await Promise.all(links.map(jsonHandler));
    return responses.flat();
}