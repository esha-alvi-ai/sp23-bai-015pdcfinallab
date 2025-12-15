// serviceB/server.js
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load proto file
const PROTO_PATH = path.join(__dirname, "image_classifier.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef);
const imagePackage = grpcObj.ImageClassifier;

// Fake AI classification
const labels = ["cat", "dog", "car", "bird"];

function uploadImage(call, callback) {
  const start = Date.now();

  const label = labels[Math.floor(Math.random() * labels.length)];
  const confidence = Number((Math.random() * 0.3 + 0.7).toFixed(2));

  const responseTime = Date.now() - start;

  console.log(`ServiceB: classified image as ${label} (${confidence}) in ${responseTime}ms`);
  
  callback(null, { label, confidence });
}

const server = new grpc.Server();
server.addService(imagePackage.service, { UploadImage: uploadImage });

server.bindAsync(
  "localhost:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("🚀 ServiceB gRPC running at localhost:50051");
    server.start();
  }
);
