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


module.exports = uuidToBase64UrlSafe;