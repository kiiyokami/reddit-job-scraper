import axios from "axios";
import { data } from './config';
import { parser } from "./json-handler";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithTimeout = async (url: string, headers: any, timeoutMs = 5000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await axios.get(url, {
            headers,
            signal: controller.signal,
            timeout: timeoutMs
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

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
        
        try {
            const response = await fetchWithTimeout(`https://oauth.reddit.com/r/${thread}/new.json?limit=25`, headers);
            const parsed = parser(response.data);
            console.log(`Successfully fetched ${parsed.length} posts from ${thread}`);
            responses.push(parsed);
        } catch (error: any) {
            console.error(`Failed to fetch ${thread}:`, error.message);
            responses.push([]);
        }
        
        await delay(1000);
    }
    
    console.log(`Completed processing ${data.subreddits.length} subreddits`);
    return responses.flat();
}