import axios from "axios";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const username = process.env.REDDIT_USERNAME;
const password = process.env.REDDIT_PASSWORD;
const user_agent = process.env.USER_AGENT;


const secret = `${clientId}:${clientSecret}`
const authentication = Buffer.from(secret).toString("base64");
const body = new URLSearchParams({
    'grant_type': 'password',
    'username': username || '',
    'password': password || ''
});


export const getAccessToken = async () => {
    const response = await axios.post("https://www.reddit.com/api/v1/access_token", body , {
        headers: {
            "Authorization": `Basic ${authentication}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            "User-Agent": user_agent
        }
    })
    return response.data.access_token;
}





