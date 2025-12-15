const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// Path of image (must exist)
const IMAGE_PATH = "./test.jpg";

// Upload SINGLE image
async function uploadImage() {
  const form = new FormData();
  form.append("image", fs.createReadStream(IMAGE_PATH));

  const start = Date.now();

  const res = await axios.post(
    "http://localhost:3000/uploadImage",
    form,
    { headers: form.getHeaders() }
  );

  const timeTaken = Date.now() - start;

  console.log("Response:", res.data);
  console.log("Time:", timeTaken, "ms");

  return timeTaken; // ✅ return time for batch calculation
}

// Upload SAME image 5 times (batch test)
async function uploadMultipleImages() {
  let totalBatchTime = 0;
  const totalImages = 5;

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

// Call batch upload
uploadMultipleImages();
