const mongoose = require("mongoose");

const WasteSchema = new mongoose.Schema({
  vendor_id: {
    type: String,
    required: true,
  },
  waste_type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Waste", WasteSchema);
