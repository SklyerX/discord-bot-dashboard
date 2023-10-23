"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsValidator = void 0;
const zod_1 = require("zod");
exports.SettingsValidator = zod_1.z.object({
    resetOnError: zod_1.z.boolean().optional(),
    dontAllowSameUser: zod_1.z.boolean().optional(),
    banOnError: zod_1.z.boolean().optional(),
});
