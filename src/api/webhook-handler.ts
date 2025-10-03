import axios from "axios";
import { DateTime } from "luxon";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const batchWebhookHandler = async (data: any) => {
    console.log(`Starting webhook handler with ${data.length} items:`, data.map((item: any) => item.title));
    
    if (!process.env.DISCORD_WEBHOOK_URL) {
        console.error('DISCORD_WEBHOOK_URL not set');
        return [];
    }
    
    const responses = [];
    
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        console.log(`Processing webhook ${i + 1}/${data.length}: ${item.title}`);
        
        try {
            const response = await axios.post(process.env.DISCORD_WEBHOOK_URL!, {
                embeds: [{
                    title: item.title,
                    description: item.description,
                    url: item.url,
                    color: 0x00ff00,
                    timestamp: DateTime.fromMillis(item.created * 1000).toISO(),
                }]
            });
            console.log(`Successfully sent webhook for: ${item.title}`);
            responses.push(response);
        } catch (error: any) {
            console.error(`Discord webhook failed for ${item.title}:`, {
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                message: error?.message,
                data: error?.response?.data
            });
            responses.push(null);
        }
        
        if (i < data.length - 1) {
            await delay(1000);
        }
    }
    
    console.log(`Completed processing ${data.length} webhooks`);
    return responses;
}

