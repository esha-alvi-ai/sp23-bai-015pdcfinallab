// Fake AI classifier
function classifyImage(imageBuffer) {
  const labels = ["cat", "dog", "car", "bird"];
  const label = labels[Math.floor(Math.random() * labels.length)];
  const confidence = Number((Math.random() * 0.3 + 0.7).toFixed(2));
  return { label, confidence };
}

module.exports = { classifyImage };
