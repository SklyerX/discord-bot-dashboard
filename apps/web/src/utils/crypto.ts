import crypto from "crypto";

const encryptionKey = Buffer.from(process.env.encryptionKey!);
const iv = Buffer.from(process.env.initialVector!);

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv("aes256", encryptionKey, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}
