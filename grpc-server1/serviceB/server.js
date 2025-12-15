const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { classifyImage } = require("./classifier");

const PROTO_PATH = "../protos/image.proto";
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef);
const imagePackage = grpcObj.imageclassifier;

function uploadImage(call, callback) {
  const result = classifyImage(call.request.imageData);
  callback(null, result);
}

const server = new grpc.Server();
server.addService(imagePackage.ImageClassifier.service, { UploadImage: uploadImage });

server.bindAsync("0.0.0.0:50052", grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("🚀 AI Model Service running at localhost:50052");
});
