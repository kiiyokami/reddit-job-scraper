const axios = require('axios');
const luxon = require('luxon');

const urlString = process.env.DISCORD_WEBHOOK_URL;

const webhookHandler = async (data: any) => {
    const payload = {
        content: null,
        embeds: [
            {
                title: data.title,
                description: data.description,
                url: data.url,
                color: 0x00ff00,
                timestamp: luxon.DateTime.fromMillis(data.created * 1000).toISO(),
            }
        ]
    };
    const response = await axios.post(urlString, payload);
    return response;
}

export const batchWebhookHandler = async (data: any) => {
    const responses = await Promise.all(data.map(webhookHandler));
    return responses;
}

