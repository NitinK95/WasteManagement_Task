const express = require("express");
const app = express();
const vendor = require("./routes/vendor");
const company = require("./routes/company");
const cookieParser = require("cookie-parser");
const {
  requireAuth,
  checkVendor,
  checkComp,
} = require("./middleware/authMiddleware");

const connectDB = require("./db/connect");

require("dotenv").config();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// routes
app.get("*", checkVendor);
app.get("*", checkComp);
app.get("/", (req, res) => res.render("home"));
app.use("/vendor", checkVendor, vendor);
app.use("/company", checkComp, company);
app.get("/vendor/recycle", requireAuth, (req, res) => res.render("recycle"));
// app.use("/vendor/recycle", )

const port = process.env.port || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
module.exports = app;
