const express = require("express");
const cors = require("cors");

const { initTRPC } = require("@trpc/server");
const { createExpressMiddleware } = require("@trpc/server/adapters/express");
const { z } = require("zod");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // To accept large base64 payloads

// Initialize tRPC
const t = initTRPC.create();

// tRPC Router
const appRouter = t.router({
  uploadImage: t.procedure
    .input(
      z.object({
        image: z.string(), // base64 encoded image
      })
    )
    .mutation(({ input }) => {
      const start = Date.now();

      // Convert base64 to buffer to calculate payload size
      const buffer = Buffer.from(input.image, "base64");

      // Fake AI classification
      const labels = ["cat", "dog", "car", "bird"];
      const label = labels[Math.floor(Math.random() * labels.length)];
      const confidence = Number((Math.random() * 0.3 + 0.7).toFixed(2));

      const responseTime = Date.now() - start;

      return {
        label,
        confidence,
        responseTime,
        payloadSize: buffer.length + " bytes",
      };
    }),
});

// Express middleware for tRPC
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(4000, () => {
  console.log("🚀 tRPC server running on http://localhost:4000/trpc");
});

// Export type for client (optional, TypeScript)
module.exports = { appRouter };
