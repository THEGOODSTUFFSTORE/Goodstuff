"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextjsFuncV2 = void 0;
const https_1 = require("firebase-functions/v2/https");
const options_1 = require("firebase-functions/v2/options");
const next = require("next");
(0, options_1.setGlobalOptions)({
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
exports.nextjsFuncV2 = (0, https_1.onRequest)(async (req, res) => {
    console.log("File: " + req.originalUrl);
    await prepared;
    handle(req, res);
});
//# sourceMappingURL=index.js.map