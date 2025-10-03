import axios from "axios";
import { data } from './config';
import { parser } from "./json-handler";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const batchFetcher = async (token: string) => {
    console.log('Starting batchFetcher with subreddits:', data.subreddits);
    
    const headers = {
        "User-Agent": process.env.USER_AGENT,
        "Authorization": `Bearer ${token}`,
    };
    
    const responses = [];
    
    for (let i = 0; i < data.subreddits.length; i++) {
        const thread = data.subreddits[i];
        console.log(`Processing thread ${i + 1}/${data.subreddits.length}: ${thread}`);
        
        try {
            const response = await axios.get(`https://oauth.reddit.com/r/${thread}/new.json?limit=25`, { 
                headers,
                timeout: 10000
            });
            const parsed = parser(response.data);
            console.log(`Successfully fetched ${parsed.length} posts from ${thread}`);
            responses.push(parsed);
        } catch (error: any) {
            console.error(`Failed to fetch ${thread}:`, {
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                message: error?.message,
                data: error?.response?.data
            });
            responses.push([]);
        }
        
        // Add delay between requests to avoid rate limiting
        if (i < data.subreddits.length - 1) {
            await delay(1000);
        }
    }
    
    console.log(`Completed processing ${data.subreddits.length} subreddits`);
    return responses.flat();
}