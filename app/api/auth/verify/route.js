import { NextResponse } from "next/server";
import { loginMsg } from "@/utils/messageForSign";

/**
 * had to install @noble/secp256k1 separately to make tronweb work
 * https://github.com/tronprotocol/tronweb/issues/481
 * */
import TronWeb from "tronweb";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { sign } from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();

    let reqJson = await request.json();

    const user = await User.findOne(
      { address: reqJson.address } // Filter by the address
    );

    let address = await TronWeb.Trx.verifyMessageV2(
      `${loginMsg}${user.nonce}`,
      reqJson.sign
    );

    let token = await sign({ address: address });

    return NextResponse.json({ auth: token }, { status: 200 });
  } catch (error) {
    console.log(error);
    console.log("fail");
  }
}
