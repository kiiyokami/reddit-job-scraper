import { DateTime } from 'luxon';
import { data } from './config';

const sevenHoursAgo = DateTime.now().minus({ hours: 7 });

export const parser = (responseData: any) => {
    return responseData.data.children
        .map((post: any) => ({
            title: post.data.title,
            description: post.data.selftext,
            url: post.data.url,
            created: post.data.created_utc,
        }))
        .filter((post: any) => {
            const titleLower = post.title.toLowerCase();
            const descLower = post.description.toLowerCase();
            return data.title_keywords.some((keyword: string) => titleLower.includes(keyword))
                && data.description_keywords.some((keyword: string) => descLower.includes(keyword))
                && DateTime.fromMillis(post.created * 1000) > sevenHoursAgo;
        });
}

