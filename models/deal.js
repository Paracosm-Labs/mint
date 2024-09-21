import mongoose, { Schema, Types } from "mongoose";

const DealSchema = new mongoose.Schema(
  {
    owner: {
      type: Types.ObjectId,
      ref: "User", // Reference to the User who created the deal
      required: true,
    },
    business: {
      type: Types.ObjectId,
      ref: "Business",
      required: true,
    },
    club: {
      type: Types.ObjectId,
      ref: "Club",
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    txID: {
      type: String,
      required: true,
    },
    onChainId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Deal = mongoose.models.Deal || mongoose.model("Deal", DealSchema);

export default Deal;
