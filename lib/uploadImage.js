import axios from "axios";
import FormData from "form-data";

export const uploadImageToPinata = async (imageFile) => {
  const PINATA_API_KEY = process.env.PINATA_API_KEY;
  const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append("file", imageFile);

  const metadata = JSON.stringify({
    name: imageFile.name,
  });

  data.append("pinataMetadata", metadata);

  try {
    const res = await axios.post(url, data, {
      maxBodyLength: "Infinity", // Prevent form-data size limitation
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    console.log("Image uploaded to IPFS via Pinata:", res.data);
    return res.data; // Contains IPFS hash and Pinata metadata
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
};

export default uploadImageToPinata;
