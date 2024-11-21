// utils/ipfs.ts
export const getGatewayUrl = (cid: string) => {
    if (!cid) return '';
    // Remove ipfs:// prefix if present
    const cleanCid = cid.replace('ipfs://', '');
    return `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cleanCid}`;
  };