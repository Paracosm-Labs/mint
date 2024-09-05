import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";


export async function POST(request, res) {
    try {
      let reqJson = await request.json();
      
      let address = reqJson.address;
      if(!address || !address.length){
        return NextResponse.json({auth : null, msg : 'Address not sent with request'}, { status: 500 });
      }

        await dbConnect();
        const foundUser = await User.findOne({ address: address });
      
          if (foundUser) {
            return NextResponse.json({ success: true }, { status: 200 });
          } else {
            return NextResponse.json({ success: false }, { status: 200 });
          }

    } catch (error) {
      console.error("Error in GET request:", error);
      return NextResponse.json({ success: false , msg: 'An unexpected error occurred' }, { status: 500 });
  }
}