// serviceA/client.js
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

async function uploadBatch(images) {
  const form = new FormData();
  images.forEach((imgPath) => {
    form.append("images", fs.createReadStream(imgPath));
  });

  const start = Date.now();
  const res = await axios.post("http://localhost:3000/uploadBatch", form, {
    headers: form.getHeaders(),
  });
  const end = Date.now();

  console.log("Batch Response:", res.data);
  console.log("Client Total End-to-End Latency:", end - start, "ms");
}

const imagePaths = [
  path.join(__dirname, "test.jpg"),
  path.join(__dirname, "test.jpg"),
  path.join(__dirname, "test.jpg"),
]; // same image 3 times for demo

uploadBatch(imagePaths);
