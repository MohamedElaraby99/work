const express = require("express");

const https = require("https");

const router = express.Router();

// مسار البروكسي
router.get("/proxy", (req, res) => {
  const targetUrl = "https://ar.ocrify.com"; // رابط الموقع الهدف

  https
    .get(targetUrl, (response) => {
      let data = "";

      // استقبال البيانات على شكل أجزاء
      response.on("data", (chunk) => {
        data += chunk;
      });

      // عند انتهاء الاستقبال، أرسل البيانات إلى العميل
      response.on("end", () => {
        res.set("Content-Type", "text/html");
        res.send(data);
      });
    })
    .on("error", (error) => {
      console.error("خطأ أثناء الاتصال بالموقع:", error.message);
      res.status(500).send("حدث خطأ أثناء الاتصال بالموقع.");
    });
});

module.exports = router;
