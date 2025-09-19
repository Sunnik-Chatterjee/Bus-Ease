// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// Your backend
const MY_SERVICE = "https://bus-easebackend.onrender.com";

// Friend's backend
const FRIEND_SERVICE = "https://bus-easeassistant.onrender.com";

// Debug middleware (to see what's happening in Render logs)
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});

// Proxy to your backend
app.use(
  "/api",
  createProxyMiddleware({
    target: MY_SERVICE,
    changeOrigin: true,
  })
);

// Proxy to friend's backend
app.use(
  "/api/v1",
  createProxyMiddleware({
    target: FRIEND_SERVICE,
    changeOrigin: true,
  })
);

// Root route just for testing
app.get("/", (req, res) => {
  res.send("Reverse proxy is running!");
});

// Use Render’s port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});

