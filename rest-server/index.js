const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

// Multer config
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Dummy AI model
function classifyImage() {
  const labels = ["cat", "dog", "car", "bird"];
  return {
    label: labels[Math.floor(Math.random() * labels.length)],
    confidence: Number((Math.random() * 0.5 + 0.5).toFixed(2)),
  };
}

// REST endpoint
app.post("/uploadImage", upload.single("image"), (req, res) => {
  const start = Date.now();

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const result = classifyImage();
  const timeTaken = Date.now() - start;

  res.json({
    label: result.label,
    confidence: result.confidence,
    responseTime: `${timeTaken} ms`,
    fileSize: `${req.file.size} bytes`,
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`REST Server running at http://localhost:${PORT}`);
});
