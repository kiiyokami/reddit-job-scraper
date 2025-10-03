import { runScript } from "./src/script";

export const handler = async () => {
    await runScript();
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Success",
        }),
    };
};

handler();

