const mongoose = require("mongoose")
const { getCurrencyListCodes, FROM } = require("../../general/currency")
const model = mongoose.Schema(
  {
    currency: {
      type: String,
      enum: getCurrencyListCodes(FROM.BACKEND),
      require: true,
    },
    amount: { type: Number, require: true },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: "donations",
  }
)

module.exports = model
