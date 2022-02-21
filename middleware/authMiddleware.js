const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor");
const Company = require("../models/company");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & its verified
  if (token) {
    jwt.verify(token, "This is a secured secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("./login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("./login");
  }
};

// check current vendor
const checkVendor = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "This is a secured secret", async (err, decodedToken) => {
      if (err) {
        res.locals.vendor = null;
        next();
      } else {
        let vendor = await Vendor.findById(decodedToken.id);
        res.locals.vendor = vendor;
        req.vendor_id = decodedToken.id;
        next();
      }
    });
  } else {
    res.locals.vendor = null;
    next();
  }
};

// check current company
const checkComp = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "This is a secured secret", async (err, decodedToken) => {
      if (err) {
        res.locals.comp = null;
        next();
      } else {
        let comp = await Company.findById(decodedToken.id);
        res.locals.comp = comp;
        next();
      }
    });
  } else {
    res.locals.comp = null;
    next();
  }
};

module.exports = { requireAuth, checkVendor, checkComp };
