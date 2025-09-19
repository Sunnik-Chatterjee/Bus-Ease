// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// Your backend
const MY_SERVICE = "https://bus-easebackend.onrender.com";

// Friend's backend
const FRIEND_SERVICE = "https://bus-easeassistant.onrender.com";

// Proxy to friend's backend (put this FIRST so it doesn’t get caught by /api)
app.use(
  "/api/v1",
  createProxyMiddleware({
    target: FRIEND_SERVICE,
    changeOrigin: true,
  })
);

// Proxy to your backend
app.use(
  "/api",
  createProxyMiddleware({
    target: MY_SERVICE,
    changeOrigin: true,
  })
);

// Root test
app.get("/", (req, res) => {
  res.send("Reverse proxy is running!");
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});

