import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// Your backend
const MY_SERVICE = "https://bus-easebackend.onrender.com";

// Friend's backend
const FRIEND_SERVICE = "https://bus-easeassistant.onrender.com";

// Proxy to your backend
app.use(
  "/api",
  createProxyMiddleware({
    target: MY_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api": "/api" }, // explicitly keep /api
  })
);

// Proxy to friend's backend
app.use(
  "/api/v1",
  createProxyMiddleware({
    target: FRIEND_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/v1": "/api/v1" }, // explicitly keep /api/v1
  })
);

app.listen(10000, () => {
  console.log("Proxy running on port 10000");
});

