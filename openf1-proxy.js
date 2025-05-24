// openf1-proxy.js

import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = 'https://api.openf1.org/v1';

// 健康检查首页
app.get('/', (req, res) => {
  res.send('✅ OpenF1 Proxy is running.');
});

// 中转接口：/proxy/race_control?session_key=XXXX
app.get('/proxy/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = `${BASE_URL}/${endpoint}?${queryString}`;

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message || 'Unknown error',
      details: err.response?.data || null,
      source: targetUrl
    });
  }
});

// 兜底：未命中的路径
app.use((req, res) => {
  res.status(404).send('❌ Endpoint not found. Try /proxy/race_control?session_key=...');
});

// 启动监听（必须绑定 0.0.0.0 以兼容 Railway）
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ OpenF1 Proxy running on port ${PORT}`);
});
