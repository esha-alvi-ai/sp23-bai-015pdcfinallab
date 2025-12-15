const fs = require("fs");
const axios = require("axios");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "../protos/image.proto";
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef);
const imagePackage = grpcObj.imageclassifier;

const IMAGE_PATH = "./test.jpg";
const imageBuffer = fs.readFileSync(IMAGE_PATH);

// --- Direct gRPC to Service B ---
const clientB = new imagePackage.ImageClassifier(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

function directGRPC() {
  const start = Date.now();
  clientB.UploadImage({ imageData: imageBuffer }, (err, res) => {
    if (err) return console.error(err);
    console.log("\n--- Direct gRPC ---");
    console.log(res);
    console.log("Time:", Date.now() - start, "ms");
  });
}

// --- Service-to-Service via Service A ---
async function viaServiceA() {
  const start = Date.now();
  const form = new FormData();
  form.append("image", fs.createReadStream(IMAGE_PATH));

  const res = await axios.post("http://localhost:50051/upload", form, {
    headers: form.getHeaders(),
  });
  console.log("\n--- Via Service A (gRPC S2S) ---");
  console.log(res.data);
  console.log("Time:", Date.now() - start, "ms");
}

directGRPC();
viaServiceA();
