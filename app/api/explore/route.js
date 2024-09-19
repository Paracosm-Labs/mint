import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import User from "../../../models/user";
import Business from "../../../models/business";
import Club from "../../../models/club";
import Deal from "../../../models/deal";

const createClubInfo = (clubAndBusiness) => {
  return clubAndBusiness.map((d) => {
    let clubInfo = {};
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
    clubInfo.id = d._id;
    clubInfo.name = d.name;
    clubInfo.description = d.description;
    clubInfo.membershipFee = d.membershipFee;
    clubInfo.category = d.business.industry;
    clubInfo.country = d.business.country;
    clubInfo.image = "https://picsum.photos/300/150?random=9";
    clubInfo.members = 0;
    clubInfo.txID = d.txID;
    clubInfo.onChainId = d.onChainId;
    return clubInfo;
  });
};

export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    await dbConnect();
    const clubAndBusiness = await Club.find()
      .populate("business") // Populates the business at the deal level
      .exec();
    let dealInfoList = createClubInfo(clubAndBusiness);
    console.log(dealInfoList);

    return NextResponse.json({ clubs: dealInfoList }, { status: 200 });
  } catch (error) {
    console.log(error);
    console.log("fail");
  }
}
