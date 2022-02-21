const Comp = require("../models/company");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//create jwt token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "This is a secured secret", {
    expiresIn: maxAge,
  });
};

const compSignup = asyncWrapper(async (req, res) => {
  res.render("companysignup");
});

const getCompLogin = asyncWrapper(async (req, res) => {
  res.render("companylogin");
});

const createComp = asyncWrapper(async (req, res) => {
  const comp = await Comp.create(req.body);
  const token = createToken(comp._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.status(201).json({ comp: comp._id });
});

// const getComp = asyncWrapper(async (req, res) => {
//   const { id: compID } = req.params;
//   const comp = await Comp.findOne({ _id: compID });
//   if (!comp) {
//     return next(createCustomError(`No company with id: ${compID}`, 404));
//   }
//   res.status(200).json({ comp });
// });

const compLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const comp = await Comp.login(email, password);
    const token = createToken(comp._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ comp: comp._id });
  } catch (error) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const compLogout = asyncWrapper(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

module.exports = {
  compSignup,
  getCompLogin,
  createComp,
  compLogin,
  compLogout,
};
