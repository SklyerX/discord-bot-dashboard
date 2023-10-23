import crypto from "node:crypto";

const encryptionKey = Buffer.from(process.env.encryptionKey!);
const iv = Buffer.from(process.env.initialVector!);

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv("aes256", encryptionKey, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

export function decrypt(encryptedText: string) {
  const decipher = crypto.createDecipheriv("aes256", encryptionKey, iv);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
