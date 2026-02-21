const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Endpoint لإنشاء Order من الفورم
app.post("/create-order", async (req, res) => {
  const orderData = req.body; // بيانات الفورم

  try {
    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE}/admin/api/2026-01/orders.json`,
      { order: orderData },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Failed to create order");
  }
});

// تصدير app لكي يتم استدعاؤه من server.js
module.exports = app;
