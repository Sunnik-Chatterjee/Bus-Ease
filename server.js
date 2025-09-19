// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const MY_SERVICE = "https://bus-easebackend.onrender.com";
const FRIEND_SERVICE = "https://bus-easeassistant.onrender.com";

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// CRITICAL FIX: Use wildcard pattern '/api/v1/*' instead of just '/api/v1'
app.use(
  "/api/v1/*",
  createProxyMiddleware({
    target: FRIEND_SERVICE,
    changeOrigin: true,
    logLevel: 'debug', // This will show proxy activity
    onError: (err, req, res) => {
      console.error("❌ FRIEND_SERVICE Proxy Error:", err.message);
      res.status(504).json({ error: "Gateway Timeout", service: "friend" });
    }
  })
);

// CRITICAL FIX: Use wildcard pattern '/api/*' instead of just '/api'
app.use(
  "/api/*",
  createProxyMiddleware({
    target: MY_SERVICE,
    changeOrigin: true,
    logLevel: 'debug', // This will show proxy activity
    onError: (err, req, res) => {
      console.error("❌ MY_SERVICE Proxy Error:", err.message);
      res.status(504).json({ error: "Gateway Timeout", service: "my" });
    }
  })
);

app.get("/", (req, res) => {
  res.send("Reverse proxy is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});

