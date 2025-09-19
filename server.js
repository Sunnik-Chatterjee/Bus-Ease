// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const MY_SERVICE = "https://bus-easebackend.onrender.com";
const FRIEND_SERVICE = "https://bus-easeassistant.onrender.com";

// Add type: "module" warning fix
// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// V3.0 syntax: Use pathFilter instead of Express route patterns
app.use(
  createProxyMiddleware({
    pathFilter: '/api/v1/**', // V3.0 wildcard syntax
    target: FRIEND_SERVICE,
    changeOrigin: true,
    logLevel: 'debug',
  })
);

app.use(
  createProxyMiddleware({
    pathFilter: '/api/**', // V3.0 wildcard syntax
    target: MY_SERVICE, 
    changeOrigin: true,
    logLevel: 'debug',
  })
);

app.get("/", (req, res) => {
  res.send("Reverse proxy is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});

