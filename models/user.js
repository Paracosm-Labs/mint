import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
    {
      address: {
        type: String,
        required: true 
      },
      nonce: {
        type: String
      },
    },
    {
      timestamps: true,
    }
  );
  

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;