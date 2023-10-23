"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.success = exports.info = exports.error = exports.warn = void 0;
const chalk_1 = __importDefault(require("chalk"));
const warn = (...logs) => {
    console.log(`${chalk_1.default.black(new Date().toUTCString())} ${chalk_1.default.yellow("WARN")}`, ...logs);
};
exports.warn = warn;
const error = (...logs) => {
    console.log(`${chalk_1.default.black(new Date().toUTCString())} ${chalk_1.default.red("ERROR")}`, ...logs);
};
exports.error = error;
const info = (...logs) => {
    console.log(`${chalk_1.default.black(new Date().toUTCString())} ${chalk_1.default.blueBright("INFO")}`, ...logs);
};
exports.info = info;
const success = (...logs) => {
    console.log(`${chalk_1.default.black(new Date().toUTCString())} ${chalk_1.default.green("SUCCESS")}`, ...logs);
};
exports.success = success;
const debug = (...logs) => {
    console.log(`${chalk_1.default.black(new Date().toUTCString())} ${chalk_1.default.magentaBright("DEBUG")}`, ...logs);
};
exports.debug = debug;
