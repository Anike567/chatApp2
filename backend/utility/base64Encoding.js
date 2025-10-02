function uuidToBase64UrlSafe(uuid) {
  // Remove dashes, convert hex -> buffer
  const hex = uuid.replace(/-/g, "");
  const buf = Buffer.from(hex, "hex");

  // Standard Base64
  let b64 = buf.toString("base64");

  // Make it URL-safe (remove = and replace +,/)
  b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return b64;
}


function base64UrlSafeToUuid(b64) {
  // Convert URL-safe Base64 back to standard Base64
  let base64 = b64.replace(/-/g, "+").replace(/_/g, "/");
  
  // Pad with '=' if needed
  while (base64.length % 4) {
    base64 += "=";
  }

  // Decode back to buffer
  const buf = Buffer.from(base64, "base64");

  // Convert buffer -> hex
  const hex = buf.toString("hex");

  // Insert dashes to match UUID format
  const uuid = [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20),
  ].join("-");

  return uuid;
}



module.exports = {uuidToBase64UrlSafe, base64UrlSafeToUuid};