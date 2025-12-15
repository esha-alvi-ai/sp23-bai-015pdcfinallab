const { createTRPCProxyClient, httpBatchLink } = require("@trpc/client");
const fs = require("fs");

// Import router type if using TypeScript
const { appRouter } = require("./server");

// Create tRPC client
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
    }),
  ],
});

// Upload single image
async function uploadImage() {
  const imageBuffer = fs.readFileSync("./test.jpg");
  const imageBase64 = imageBuffer.toString("base64");

  const start = Date.now();

  const res = await client.uploadImage.mutate({
    image: imageBase64,
  });

  const timeTaken = Date.now() - start;

  console.log("Response:", res);
  console.log("Client Time:", timeTaken, "ms");

  return timeTaken;
}

// Upload same image multiple times (batch)
async function uploadMultipleImages(totalImages = 5) {
  let totalBatchTime = 0;

  for (let i = 1; i <= totalImages; i++) {
    console.log(`\nUploading image attempt ${i}`);
    const time = await uploadImage();
    totalBatchTime += time;
  }

  console.log("\nTotal Batch Time:", totalBatchTime, "ms");
  console.log(
    "Average Time per Image:",
    (totalBatchTime / totalImages).toFixed(2),
    "ms"
  );
}

// Run batch test
uploadMultipleImages(5);
