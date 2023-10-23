"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const logger_1 = require("../utils/logger");
(0, mongoose_1.connect)(process.env.MONGODB_CONNECTION_STRING_URI).then(() => {
    (0, logger_1.debug)(`Successfully connected to the database`);
});
