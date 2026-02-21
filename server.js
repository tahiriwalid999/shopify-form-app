const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.send("Shopify App is running");
});

// نقطة تثبيت التطبيق
app.get("/auth", (req, res) => {
  const shop = req.query.shop;

  if (!shop) {
    return res.status(400).send("Missing shop parameter");
  }

  const redirectUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_orders,write_orders&redirect_uri=${process.env.SHOPIFY_REDIRECT_URI}`;

  res.redirect(redirectUrl);
});

// OAuth callback
app.get("/auth/callback", async (req, res) => {
  const { shop, code } = req.query;

  try {
    const response = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code
      }
    );

    const accessToken = response.data.access_token;

    console.log("ACCESS TOKEN:", accessToken);

    res.send("App installed successfully!");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("OAuth failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
