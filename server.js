// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// URLs of your deployed Render services
const MY_SERVICE = "https://bus-easebackend.onrender.com";
const FRIEND_SERVICE = "https://bus-easeassistant.onrender.com";

// Forward /api/v1 requests to friend's service
app.use("/api/v1", createProxyMiddleware({
  target: FRIEND_SERVICE,
  changeOrigin: true,
  pathRewrite: { "^/api/v1": "/api/v1" } // keep the /api/v1 prefix
}));

// Forward /api requests to your service
app.use("/api", createProxyMiddleware({
  target: MY_SERVICE,
  changeOrigin: true
}));

// Root route just for testing
app.get("/", (req, res) => {
  res.send("Reverse proxy is running!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

