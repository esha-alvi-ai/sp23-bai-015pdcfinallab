const express = require("express");
const cors = require("cors");
const multer = require("multer");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const upload = multer();
const app = express();
app.use(cors());

const PROTO_PATH = "../protos/image.proto";
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef);
const imagePackage = grpcObj.imageclassifier;

// gRPC client for Service B
const clientB = new imagePackage.ImageClassifier(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

app.post("/upload", upload.single("image"), (req, res) => {
  const start = Date.now();

  clientB.UploadImage({ imageData: req.file.buffer }, (err, response) => {
    if (err) return res.status(500).send(err);
    const timeTaken = Date.now() - start;
    res.json({
      ...response,
      serviceATime: timeTaken + " ms",
      payloadSize: req.file.size + " bytes",
    });
  });
});

app.listen(50051, () => {
  console.log("🚀 API Service running at http://localhost:50051");
});
