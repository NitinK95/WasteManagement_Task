const express = require("express");
const router = express.Router();

const {
  compSignup,
  getCompLogin,
  createComp,
  compLogin,
  compLogout,
} = require("../controllers/companyController");

router.route("/signup").post(createComp).get(compSignup);
router.route("/login").post(compLogin).get(getCompLogin);
router.route("/logout").get(compLogout);

module.exports = router;
