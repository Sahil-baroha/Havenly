const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, require: true },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/8-bit-pixel-art-sunset-beach-2353966679",
      set: (v) =>
        v === ""
          ? "https://www.shutterstock.com/image-vector/8-bit-pixel-art-sunset-beach-2353966679"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
