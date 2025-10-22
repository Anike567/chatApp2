async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // extractable (can export)
    ["encrypt", "decrypt"]
  );

  const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  const publicKeyPem = arrayBufferToPem(publicKey, "PUBLIC KEY");
  const privateKeyPem = arrayBufferToPem(privateKey, "PRIVATE KEY");

  console.log(publicKeyPem);
  console.log(privateKeyPem);

  return { publicKeyPem, privateKeyPem };
}

// helper to convert binary keys to PEM
function arrayBufferToPem(buffer, label) {
  const base64Key = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const pemKey = `-----BEGIN ${label}-----\n${base64Key.match(/.{1,64}/g).join('\n')}\n-----END ${label}-----`;
  return pemKey;
}
export default generateKeyPair;