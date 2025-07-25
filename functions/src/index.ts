import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import next from "next";

// Set global options
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

const isDev = process.env.NODE_ENV !== "production";
const app = next({
  dev: isDev,
  conf: {
    distDir: ".next"
  }
});

const handle = app.getRequestHandler();

export const nextjs = onRequest(
  {
    memory: "1GiB",
    timeoutSeconds: 60,
    maxInstances: 10,
  },
  async (req, res) => {
    console.log("Request received:", req.url);
    
    // Prepare Next.js
    await app.prepare();
    
    // Handle the request
    return handle(req, res);
  }
); 