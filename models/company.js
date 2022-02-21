const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must provide a company name"],
    trim: true,
    maxlength: [50, "company name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    trim: true,
    requried: true,
    unique: true,
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
  contact_no: {
    type: Number,
    required: [true, "please enter a contact nunmber"],
  },
  waste_type: {
    type: String,
    required: true,
  },
});

// fire a function before doc saved to db
CompanySchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  static method to login company
CompanySchema.statics.login = async function (email, password) {
  const comp = await this.findOne({ email });
  if (comp) {
    const auth = await bcrypt.compare(password, comp.password);
    if (auth) {
      return comp;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

module.exports = mongoose.model("Company", CompanySchema);
