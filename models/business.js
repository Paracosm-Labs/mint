import mongoose, { Schema, Types } from "mongoose";

const BusinessSchema = new mongoose.Schema(
    {
        owner: {
            type: Types.ObjectId,
            ref: 'User',  // Reference to the User who created the deal
            required: true,
        },        
        name: {
            type: String,
          },
          industry: {
              type: String,
            },            
          country: {
            type: String,
          },
    },
    {
      timestamps: true,
    }
)


const Business = mongoose.models.Business || mongoose.model("Business", BusinessSchema);

export default Business;