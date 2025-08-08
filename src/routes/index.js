const express = require("express");
const publicRoutes = require("./public-routes.js");
const userRoutes = require("./user-routes.js");
const AdminRoutes = require("./admin-routes.js");
const SellerRoutes = require("./seller-routes.js");
const CustomerRoutes = require("./customer-routes.js");
require("dotenv/config");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    app_name: process.env.APP_NAME,
    message: "Server its Running  🚀 ",
    author: "Muhammad Isa",
    status_code: 200,
  });
});

router.get("/api", (req, res) => {
  res.status(200).json({
    app_name: process.env.APP_NAME,
    message: "Api its Running  🚀 ",
    author: "Muhammad Isa",
    status_code: 200,
  });
});
router.use("/api/", publicRoutes);
router.use("/api/", AdminRoutes);
router.use("/api/", SellerRoutes);
router.use("/api/", CustomerRoutes);
router.use("/api/", userRoutes);
router.use("*", (req, res, next) => {
  res.status(404).json({
    message: "Request Not Found",
    status_code: 404,
  });
});

module.exports = router;
