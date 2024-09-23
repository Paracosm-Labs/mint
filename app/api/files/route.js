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

    console.log(url);

    return NextResponse.json({ url }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
