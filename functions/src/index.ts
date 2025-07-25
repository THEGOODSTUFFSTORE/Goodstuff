import * as functions from "firebase-functions";
const next = require("next");

const isDev = false;
const app = next({
  dev: isDev,
  conf: { distDir: ".next" },
});

const handle = app.getRequestHandler();

export const nextjsFunc = functions
  .region("us-central1")
  .runWith({
    memory: "1GB",
    timeoutSeconds: 60,
  })
  .https.onRequest(async (req, res) => {
    console.log("File: " + req.originalUrl); // log the page.js file that is being requested
    await app.prepare();
    handle(req, res);
  }); 