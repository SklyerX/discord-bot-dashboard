"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const encryptionKey = Buffer.from(process.env.encryptionKey);
const iv = Buffer.from(process.env.initialVector);
function encrypt(text) {
    const cipher = node_crypto_1.default.createCipheriv("aes256", encryptionKey, iv);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}
exports.encrypt = encrypt;
function decrypt(encryptedText) {
    const decipher = node_crypto_1.default.createDecipheriv("aes256", encryptionKey, iv);
    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
exports.decrypt = decrypt;
