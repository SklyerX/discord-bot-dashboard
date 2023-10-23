"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelValidator = void 0;
const zod_1 = require("zod");
exports.ChannelValidator = zod_1.z.object({
    channelId: zod_1.z.string(),
});
