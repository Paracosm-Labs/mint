import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import User from "../../../models/user";
import Business from "../../../models/business";
import Club from "../../../models/club";
import Deal from "../../../models/deal"; 


const createDealInfo = (dealsWithClubAndBusiness)=> {
    return dealsWithClubAndBusiness.map(d => {
        let di = {};
        /*
  {
      "id": 9,
      "name": "TaxiPro Ride Discount Club",
      "description": "Join the TaxiPro Ride Discount Club to enjoy group-negotiated discounts on rides and transport services.",
      "membershipFee": 6,
      "category": "Travel",
      "country": "Netherlands",
      "image": "https://picsum.photos/300/150?random=9",
      "members": 70
  }
        */
        di.id = d._id;
        di.name = d.club.name;
        di.description = d.description;
        di.membershipFee = d.club.membershipFee;
        di.category = d.club.business.industry;
        di.country = d.club.business.country; 
        di.image = "https://picsum.photos/300/150?random=9";
        di.members = 0;
        return di;
    })
}


export async function GET(request) {
    try {
        await dbConnect();
        const dealsWithClubAndBusiness = await Deal.find()
        .populate({path: 'club',
            populate: {
                path: 'business', // Populates the business within the club
                },
            })
            .populate('business') // Populates the business at the deal level
            .exec();
            let dealInfoList = createDealInfo(dealsWithClubAndBusiness);
            console.log(dealInfoList);
            
            return NextResponse.json({clubs : dealInfoList}, { status: 200 });
    } catch (error) {
        console.log(error);
        console.log("fail");
        
    }
}