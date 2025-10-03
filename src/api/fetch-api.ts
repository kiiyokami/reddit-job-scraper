import axios from "axios";
import { data } from './config';
import { parser } from "./json-handler";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const batchFetcher = async (token: string) => {
    console.log('Starting batchFetcher with subreddits:', data.subreddits);
    
    const headers = {
        "User-Agent": process.env.USER_AGENT || "Reddit-Fetcher/1.0",
        "Authorization": `Bearer ${token}`,
    };
    
    const responses = [];
    
    for (let i = 0; i < data.subreddits.length; i++) {
        const thread = data.subreddits[i];
        if (!thread) continue;
        
        console.log(`Processing thread ${i + 1}/${data.subreddits.length}: ${thread}`);
        
        let success = false;
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const response = await axios.get(`https://oauth.reddit.com/r/${thread}/new.json?limit=25`, { 
                    headers, 
                    timeout: 8000 
                });
                const parsed = parser(response.data);
                console.log(`Successfully fetched ${parsed.length} posts from ${thread}`);
                responses.push(parsed);
                success = true;
                break;
            } catch (error: any) {
                console.log(`Attempt ${attempt} failed for ${thread}:`, error?.response?.status);
                if (attempt === 2) {
                    console.error(`Failed to fetch ${thread} after 2 attempts`);
                    responses.push([]);
                } else {
                    await delay(2000);
                }
            }
        }
        
        if (success && i < data.subreddits.length - 1) {
            await delay(3000);
        }
    }
    
    console.log(`Completed processing ${data.subreddits.length} subreddits`);
    return responses.flat();
}