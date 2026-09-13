const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type Dimensions = { width: number; height: number };

function readUint32(bytes: Uint8Array, offset: number) {
  return (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
}

function readUint16(bytes: Uint8Array, offset: number) {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function getPngDimensions(bytes: Uint8Array): Dimensions | null {
  if (bytes.length < 24 || readUint32(bytes, 0) !== 0x89504e47 || readUint32(bytes, 4) !== 0x0d0a1a0a) return null;
  return { width: readUint32(bytes, 16), height: readUint32(bytes, 20) };
}

function getWebpDimensions(bytes: Uint8Array): Dimensions | null {
  if (bytes.length < 30 || String.fromCharCode(...bytes.slice(0, 4)) !== "RIFF" || String.fromCharCode(...bytes.slice(8, 12)) !== "WEBP") return null;
  const chunk = String.fromCharCode(...bytes.slice(12, 16));
  if (chunk === "VP8X") return { width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) };
  if (chunk === "VP8 ") return { width: readUint16(bytes, 26), height: readUint16(bytes, 28) };
  return null;
}

function getJpegDimensions(bytes: Uint8Array): Dimensions | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    const marker = bytes[offset + 1];
    const length = readUint16(bytes, offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { width: readUint16(bytes, offset + 7), height: readUint16(bytes, offset + 5) };
    if (marker >= 0xc5 && marker <= 0xc7) return { width: readUint16(bytes, offset + 7), height: readUint16(bytes, offset + 5) };
    if (marker >= 0xc9 && marker <= 0xcb) return { width: readUint16(bytes, offset + 7), height: readUint16(bytes, offset + 5) };
    if (marker >= 0xcd && marker <= 0xcf) return { width: readUint16(bytes, offset + 7), height: readUint16(bytes, offset + 5) };
    offset += 2 + length;
  }
  return null;
}

export async function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Only JPEG, PNG, and WebP images are allowed.");
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) throw new Error("Images must be smaller than 5 MB.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const dimensions = file.type === "image/png" ? getPngDimensions(bytes) : file.type === "image/webp" ? getWebpDimensions(bytes) : getJpegDimensions(bytes);
  if (!dimensions || dimensions.width < 120 || dimensions.height < 120 || dimensions.width > 10000 || dimensions.height > 10000) {
    throw new Error("The image dimensions must be between 120px and 10000px on each side.");
  }

  return { bytes, width: dimensions.width, height: dimensions.height };
}
