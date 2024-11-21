// app/components/upload.js
"use client";
import { useState } from "react";
// import Image from "next/image";

export default function Upload({ setImageUrl }) {
  const [file, setFile] = useState();
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const response = await uploadRequest.json();
      
      setImageUrl({
        url: response.url,        // ipfs://<cid> for NFT metadata
        displayUrl: response.displayUrl  // gateway URL for display
      });
      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // setPreviewUrl(URL.createObjectURL(selectedFile)); // Create preview URL
    }
  };

  return (
    <div className="border p-3">
      <input type="file" accept="image/jpeg, image/png" onChange={handleChange} />
      {/* {previewUrl && (
        <Image src={previewUrl} alt="Preview" 
        width={400} 
        height={200} 
        style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
      )} */}
      <button className="btn btn-outline-secondary" disabled={uploading} onClick={uploadFile}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
