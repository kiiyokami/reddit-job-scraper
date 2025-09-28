const { batchFetcher } = require('./api/json-handler');
const { batchWebhookHandler } = require('./api/webhook-handler');

export const runScript = async () => {
  try {
    const data = await batchFetcher();
    await batchWebhookHandler(data);
    console.log("Successfully sent to discord webhook");
  } catch (error) {
    console.error(error);
  }
}

runScript();

// exports.handler = async (event: any) => {
//   runScript();
//   return 'Successfully sent to discord webhook';
// };










