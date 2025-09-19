import ImageKit from "imagekit";
import app from "./app.js";
import { env } from "./env.js";

export const imageKit = new ImageKit({
    publicKey: env.IMAGEKIT_PUBLIC_KEY,
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: env.IMAGEKIT_URL_ENDPOINT
})

const port = env.PORT;
const server = app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
});

server.on("error", (err) => {
    if ("code" in err && err.code === "EADDRINUSE") {
        console.error(`Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`);
    }
    else {
        console.error("Failed to start server:", err);
    }
    process.exit(1);
});
