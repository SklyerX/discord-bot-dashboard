"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("sessions", new mongoose_1.Schema({
    _id: String,
    expiresAt: Date,
    session: String,
}));
