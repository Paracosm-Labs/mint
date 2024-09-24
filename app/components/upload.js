// // app/components/upload.js
// "use client";
// import { useState } from "react";

// export default function Upload({ setImageUrl }) {
//   const [file, setFile] = useState();
//   const [url, setUrl] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const uploadFile = async () => {
//     try {
//       if (!file) {
//         alert("No file selected");
//         return;
//       }

//       setUploading(true);
//       const data = new FormData();
//       data.set("file", file);
//       const uploadRequest = await fetch("/api/files", {
//         method: "POST",
//         body: data,
//       });
//       const signedUrl = await uploadRequest.json();
//       console.log(signedUrl);

//       setUrl(signedUrl);
//       setUploading(false);

//       setImageUrl(signedUrl);
//     } catch (e) {
//       console.log(e);
//       setUploading(false);
//       alert("Trouble uploading file");
//     }
//   };

//   const handleChange = (e) => {
//     setFile(e.target?.files?.[0]);
//   };

//   return (
//     <div className="">
//       <input type="file" accept="image/jpeg, image/png" onChange={handleChange} />
//       <button disabled={uploading} onClick={uploadFile}>
//         {uploading ? "Uploading..." : "Upload"}
//       </button>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import Image from "next/image";

export default function Upload({ setImageUrl }) {
  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

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
      const signedUrl = await uploadRequest.json();
      console.log(signedUrl);
      
      setUrl(signedUrl);
      setImageUrl(signedUrl);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Create preview URL
    }
  };

  return (
    <div>
      <input type="file" accept="image/jpeg, image/png" onChange={handleChange} />
      {/* {previewUrl && (
        <Image src={previewUrl} alt="Preview" 
        width={400} 
        height={200} 
        style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
      )} */}
      <button disabled={uploading} onClick={uploadFile}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
