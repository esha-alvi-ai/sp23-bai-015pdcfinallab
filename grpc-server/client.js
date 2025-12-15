const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const fs = require("fs");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "image.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDef).imageclassifier;

// Create client
const client = new proto.ImageClassifier("localhost:50051", grpc.credentials.createInsecure());

function uploadImage(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const start = Date.now();

  return new Promise((resolve, reject) => {
    client.UploadImage({ imageData: imageBuffer }, (err, response) => {
      if (err) return reject(err);

      const timeTaken = Date.now() - start;
      console.log(`Uploaded: ${filePath}`);
      console.log("Response:", response);
      console.log("Latency:", timeTaken, "ms");
      console.log("Payload Size:", imageBuffer.length, "bytes\n");

      resolve(timeTaken);
    });
  });
}

// Batch upload multiple images
async function uploadBatch() {
  const images = [
    "./test.jpg",
    "./test.jpg",
    "./test.jpg",
    "./test.jpg",
    "./test.jpg"
  ];

  let totalTime = 0;

  for (let i = 0; i < images.length; i++) {
    const time = await uploadImage(images[i]);
    totalTime += time;
  }

  console.log("=== Batch Summary ===");
  console.log("Total Batch Time:", totalTime, "ms");
  console.log("Average Time per Image:", (totalTime / images.length).toFixed(2), "ms");
}

uploadBatch();
