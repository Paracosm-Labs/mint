import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import generateNonce from "@/lib/nonce";
import {loginMsg} from "@/utils/messageForSign";
 


export async function POST(request, res) {
    try {
      let reqJson = await request.json();
      
      let address = reqJson.address;
      if(!address || !address.length){
        return NextResponse.json({auth : null, msg : 'Address not sent with request'}, { status: 500 });
      }
      console.log(address);

        await dbConnect();

        let nonce  = generateNonce();

        const updatedUser = await User.findOneAndUpdate(
            { address: address },     
            { nonce: nonce },          
            { new: true }             
          );
      
          if (updatedUser) {
            console.log('Nonce updated successfully:', updatedUser);
            return NextResponse.json({ nonce: `${loginMsg}${nonce}` }, { status: 200 });
          } else {
            console.log('User not found with the given address.');
            return NextResponse.json({auth : null, msg : 'User not found with the given address.'}, { status: 500 });
          }

    } catch (error) {
        console.log(error);
        console.log("fail");
    }
    return NextResponse.json({auth : "BLOWN"}, { status: 500 });
}