const Waste = require("../models/waste");
const asyncWrapper = require("../middleware/async");

const createWaste = asyncWrapper(async (req, res) => {
  req.body.vendor_id = req.vendor_id;
  const waste = await Waste.create(req.body);
  res.status(201).json({ waste: waste._id });
});

module.exports = { createWaste };
