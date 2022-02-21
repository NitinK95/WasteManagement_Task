const express = require("express");
const router = express.Router();

const {
  getVendorLogin,
  vendorSignup,
  createVendor,
  vendorLogin,
  vendorLogout,
  getVendorDashboard,
} = require("../controllers/vendorController");

const { createWaste } = require("../controllers/wasteController");

router.route("/signup").get(vendorSignup).post(createVendor);
router.route("/login").post(vendorLogin).get(getVendorLogin);
router.route("/logout").get(vendorLogout);
router.route("/dashboard").get(getVendorDashboard).post(createWaste);

module.exports = router;
