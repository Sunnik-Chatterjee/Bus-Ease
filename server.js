// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const MY_SERVICE = "https://bus-easebackend.onrender.com";
const FRIEND_SERVICE = "https://bus-easeassistant.onrender.com";

// Debug middleware
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});

// IMPORTANT: More specific routes first - /api/v1 must come before /api
app.use(
  "/api/v1",
  createProxyMiddleware({
    target: FRIEND_SERVICE,
    changeOrigin: true,
    // DO NOT remove /api/v1 - the backend expects it
    onProxyReq: (proxyReq, req, res) => {
      console.log("Forwarding to FRIEND_SERVICE:", FRIEND_SERVICE + req.originalUrl);
    },
  })
);

// Less specific route - handles /api/buses/* endpoints  
app.use(
  "/api",
  createProxyMiddleware({
    target: MY_SERVICE,
    changeOrigin: true,
    // DO NOT remove /api - the backend expects it
    onProxyReq: (proxyReq, req, res) => {
      console.log("Forwarding to MY_SERVICE:", MY_SERVICE + req.originalUrl);
    },
  })
);

app.get("/", (req, res) => {
  res.send("Reverse proxy is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});

