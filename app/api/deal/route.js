import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import Deal from "@/models/deal";

export async function POST(request) {
  try {
    let reqJson = await request.json();

    await dbConnect();

    const deal = await Deal.create({
      description: reqJson.description,
      owner: reqJson.owner,
      business: reqJson.business,
      club: reqJson.club,
      txID: reqJson.txID,
      image: reqJson.image,
    });

    return NextResponse.json(deal, { status: 200 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { auth: null, error: `${error}` },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    let clubId = request.nextUrl.searchParams.get("club");
    console.log(clubId);
    await dbConnect();

    const dealList = await Deal.find({ club: clubId }).exec();

    console.log(dealList);

    return NextResponse.json(dealList, { status: 200 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { auth: null, error: `${error}` },
      { status: 400 }
    );
  }
}
