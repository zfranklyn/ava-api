"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
var debug = require("debug")("debug/participant.router");
var express = require('express');
// tslint:enable
var ParticipantRouter = express.Router();
exports.ParticipantRouter = ParticipantRouter;
ParticipantRouter.get("/", function (req, res, next) {
    debug("hit participant.router GET");
    res.send("respond with a resource");
});
