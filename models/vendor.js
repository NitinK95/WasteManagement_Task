const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const VendorSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "must provide a first name"],
    trim: true,
    maxlength: [50, "first name cannot be more than 50 characters"],
  },
  last_name: {
    type: String,
    required: [true, "must provide a last name"],
    trim: true,
    maxlength: [50, "last name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    trim: true,
    requried: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, "invalid email"],
  },
  street_address: {
    type: String,
    required: true,
    maxlength: 95,
  },
  city: {
    type: String,
    required: true,
    maxlength: 35,
  },
  password: {
    type: String,
    required: [true, "please enter an password"],
    minlength: [6, "minimum password length is 6 characters"],
  },
});

// fire a function before doc saved to db
VendorSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  static method to login vendor
VendorSchema.statics.login = async function (email, password) {
  const vendor = await this.findOne({ email });
  if (vendor) {
    const auth = await bcrypt.compare(password, vendor.password);
    if (auth) {
      return vendor;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

module.exports = mongoose.model("Vendor", VendorSchema);
