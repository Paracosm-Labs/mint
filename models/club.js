import mongoose, { Schema, Types } from "mongoose";

const ClubSchema = new mongoose.Schema(
    { 
        owner: {
            type: Types.ObjectId,
            ref: 'User',  
            required: true,
        },
        business: {
            type: Types.ObjectId,
            ref: 'Business',  
            required: true,
        },                
        name: {
          type: String,
          required: true 
        },
        type: {
          type: String,
          required: true 
        },
        description: {
          type: String,
        },
        membershipFee: {
            type: Number,
            required: true, 
        },                  
      },
      {
        timestamps: true,
      }
)

const Club = mongoose.models.Club || mongoose.model("Club", ClubSchema);

export default Club;