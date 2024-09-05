import { NextResponse } from "next/server";
import {businessOnboardingMsg} from "@/utils/messageForSign";

/**
 * had to install @noble/secp256k1 separately to make tronweb work
 * https://github.com/tronprotocol/tronweb/issues/481
 * */
import TronWeb from "tronweb";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Business from "@/models/business";
import Club from "@/models/club";
import Deal from "@/models/deal"; 
import {generateAuthToken} from "@/lib/auth";


export async function POST(request) {
    let address = null;
    try {

        let reqJson  = await request.json();

        address = await TronWeb.Trx.verifyMessageV2(businessOnboardingMsg, reqJson.sign);

        await dbConnect();

        const user = await User.create({address : address});   
        const business = await Business.create({...reqJson.businessInfo, owner : user._id}); 
        const club = await Club.create({...reqJson.clubInfo, owner : user._id, business : business._id, txID : reqJson.txID}); 
        if(reqJson.dealInfo){
            const deal = await Deal.create({...reqJson.dealInfo, owner : user._id, business : business._id, club : club._id}); 
        }

        let token = generateAuthToken(address);

        return NextResponse.json({auth : token}, { status: 200 });
    } catch (error) {
        // Check if the error is a duplicate key error
        if (error.code === 11000) {
            console.error('Error: Duplicate address found:', address);
            return NextResponse.json({auth : null, error : `You have already registered with address ${address}`}, { status: 400 });
            } else {
            console.error('Error creating user:', error);
            return NextResponse.json({auth : null, error : `${error}`}, { status: 400 });
            }
        console.log(error);
        console.log("fail");
        
    }
}