const Vendor = require("../models/vendor");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");
const jwt = require("jsonwebtoken");

//create jwt token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "This is a secured secret", {
    expiresIn: maxAge,
  });
};

const vendorSignup = asyncWrapper(async (req, res) => {
  res.render("signup");
});

const getVendorLogin = asyncWrapper(async (req, res) => {
  res.render("login");
});

const getVendorDashboard = asyncWrapper(async (req, res) => {
  res.render("dashboard");
});

const createVendor = asyncWrapper(async (req, res) => {
  const vendor = await Vendor.create(req.body);
  const token = createToken(vendor._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.status(201).json({ vendor: vendor._id });
});

const getVendor = asyncWrapper(async (req, res) => {
  const { id: vendorID } = req.params;
  const vendor = await Vendor.findOne({ _id: vendorID });
  if (!vendor) {
    return next(createCustomError(`No vendor with id: ${vendorID}`, 404));
  }
  res.status(200).json({ vendor });
});

const vendorLogin = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const vendor = await Vendor.login(email, password);
  const token = createToken(vendor._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.status(200).json({ vendor: vendor._id });
});

const vendorLogout = asyncWrapper(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

module.exports = {
  getVendorLogin,
  vendorSignup,
  createVendor,
  getVendor,
  vendorLogin,
  vendorLogout,
  getVendorDashboard,
};
