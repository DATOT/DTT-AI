import app from "./app";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Chat API running on http://localhost:${PORT}`);
});
