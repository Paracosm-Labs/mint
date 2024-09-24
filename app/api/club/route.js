//app/api/club/route.js
import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import User from "../../../models/user";
import Business from "../../../models/business";
import Club from "../../../models/club";
import Deal from "../../../models/deal";
export async function POST(request) {
  try {
    let reqJson = await request.json();

    const { clubTxIDs } = reqJson;

    if (!clubTxIDs || clubTxIDs.length === 0) {
      return NextResponse.json({}, { status: 400 });
    }

    await dbConnect();

    const clubs = await Club.find({ txID: { $in: clubTxIDs } }).populate(
      "business"
    );

    return NextResponse.json({ clubs: clubs }, { status: 200 });
  } catch (error) {
    console.error("Error getting clubs:", error);
    return NextResponse.json(
      { auth: null, error: `${error}` },
      { status: 400 }
    );
  }
}
