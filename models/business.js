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
            required: true 
          },
          industry: {
              type: String,
              required: true 
            },            
          country: {
            type: String,
            required: true 
          },
    },
    {
      timestamps: true,
    }
)


const Business = mongoose.models.Business || mongoose.model("Business", BusinessSchema);

export default Business;