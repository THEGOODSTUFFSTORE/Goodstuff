import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";
import type { Request, Response } from "express";

const next = require("next");

setGlobalOptions({
  region: "us-central1",
  memory: "1GiB",
  timeoutSeconds: 60,
});

const isDev = false;
const app = next({
  dev: isDev,
  conf: { distDir: ".next" },
});

const handle = app.getRequestHandler();

// Prepare Next.js once and reuse across invocations
const prepared = app.prepare();

export const nextjsFunc = onRequest(async (req: Request, res: Response) => {
  console.log("File: " + (req as any).originalUrl);
  await prepared;
  handle(req, res);
});