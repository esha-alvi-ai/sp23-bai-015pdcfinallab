// serviceA/server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const upload = multer();
const app = express();
app.use(cors());

const PROTO_PATH = path.join(__dirname, "../serviceB/image_classifier.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef);
const imagePackage = grpcObj.ImageClassifier;

const clientB = new imagePackage(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Single image endpoint
app.post("/uploadImage", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send("No image uploaded");

  const start = Date.now();

  clientB.UploadImage({ imageData: req.file.buffer }, (err, response) => {
    const end = Date.now();
    if (err) return res.status(500).send(err);

    res.json({
      ...response,
      endToEndLatency: end - start + "ms",
      payloadSize: req.file.size + " bytes",
    });
  });
});

// Batch endpoint
app.post("/uploadBatch", upload.array("images", 10), async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).send("No images uploaded");

  const results = [];
  const batchStart = Date.now();

  for (const file of req.files) {
    const start = Date.now();
    const response = await new Promise((resolve, reject) => {
      clientB.UploadImage({ imageData: file.buffer }, (err, resp) => {
        if (err) reject(err);
        else resolve(resp);
      });
    });
    const end = Date.now();
    results.push({
      ...response,
      endToEndLatency: end - start + "ms",
      payloadSize: file.size + " bytes",
    });
  }

  const batchEnd = Date.now();
  res.json({
    batchResults: results,
    totalBatchTime: batchEnd - batchStart + "ms",
    avgTimePerImage: ((batchEnd - batchStart) / req.files.length).toFixed(2) + "ms",
  });
});

app.listen(3000, () => {
  console.log("🚀 ServiceA running at http://localhost:3000");
});
