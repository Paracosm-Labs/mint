import { NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    // Upload file to Pinata
    const uploadData = await pinata.upload.file(file);
    
    // Generate a signed URL
    const url = await pinata.gateways.createSignedURL({
      cid: uploadData.cid,
      expires: 3600 * 24 * 60 * 60, // 60 days
    });

    // Store the CID with ipfs:// prefix for NFT metadata
    // const ipfsUrl = `ipfs://${uploadData.cid}`;
    // Generate gateway URL for frontend display
    // const displayUrl = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${uploadData.cid}`;

    return NextResponse.json({ 
      url: url,      // for NFT metadata
      displayUrl: url  // for frontend display
    }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}