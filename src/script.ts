import { batchFetcher } from "./api/fetch-api";
import { batchWebhookHandler } from "./api/webhook-handler";
import { getAccessToken } from "./api/reddit-auth";

export const runScript = async () => {
  try {
    const token = await getAccessToken();
    const data = await batchFetcher(token);
    await batchWebhookHandler(data);
    console.log("Successfully sent to discord webhook");
  } catch (error) {
    console.error(error);
  }
}














