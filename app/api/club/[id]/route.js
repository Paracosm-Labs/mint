// app/api/club/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Club from "@/models/club";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Club ID is required" }, { status: 400 });
    }

    await dbConnect();

    const club = await Club.findOne({ _id: id }) 
      .populate({ path: "business", select: "industry country" })
      .exec();

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    return NextResponse.json({ club }, { status: 200 });
  } catch (error) {
    console.error("Error getting club details:", error);
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}