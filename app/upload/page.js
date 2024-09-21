"use client";

import { useState } from "react";
import Upload from "../components/upload";
import Image from "next/image";

export default function UploadPage() {
  const [url, setUrl] = useState();
  return (
    <div>
      <Upload setImageUrl={setUrl}></Upload>
      {url && (
        <Image
          loader={() => url}
          // fill={true}
          width={100}
          height={100}
          src={url}
          alt="Uploaded Image"
        />
      )}
    </div>
  );
}
