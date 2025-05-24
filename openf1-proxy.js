// openf1-proxy 项目结构

// 📁 项目结构说明：
// openf1-proxy/
// ├── package.json            // 项目配置文件
// ├── openf1-proxy.js         // 主入口，Express 应用逻辑
// ├── .env                    // 环境变量（可选）
// └── README.md               // 项目说明文档

// openf1-proxy.js
import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = "https://api.openf1.org/v1";

// Proxy endpoint: /proxy/{endpoint}?{query}
app.get("/proxy/:endpoint", async (req, res) => {
  try {
    const { endpoint } = req.params;
    const query = new URLSearchParams(req.query).toString();
    const targetUrl = `${BASE_URL}/${endpoint}?${query}`;

    const response = await axios.get(targetUrl);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ OpenF1 Proxy running on port ${PORT}`);
});

