const mongoose = require("mongoose");

const storeSchema = mongoose.Schema(
  {
    verified: {
      type: String,
      enum: ['true', 'false'],
      default: false
    },
    username: {
      type: String,
      unique: true,
      required: true
    },
    userId: {
      type: String,
      required: true
    },

    business_type: {
      type: [String],
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postal_code: {
      type: String,
      required: true
    },
    date_attended: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "Show",
      enum: ["Show", "Hide"],
    },
    crateAt: {
      type: Date,
      default: Date.now()
    }

  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
