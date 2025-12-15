const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "image.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDef).imageclassifier;

const labels = ["cat", "dog", "car", "bird"];

// Unary RPC function
function uploadImage(call, callback) {
  const imageBuffer = call.request.imageData;

  const label = labels[Math.floor(Math.random() * labels.length)];
  const confidence = Number((Math.random() * 0.3 + 0.7).toFixed(2));

  callback(null, { label, confidence });

  console.log(`Received image: ${imageBuffer.length} bytes → ${label}, confidence: ${confidence}`);
}

// Start server
const server = new grpc.Server();
server.addService(proto.ImageClassifier.service, { UploadImage: uploadImage });
server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
  console.log("🚀 gRPC server running at localhost:50051");
 
});
