"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var ParticipantRouter = express.Router();
exports.ParticipantRouter = ParticipantRouter;
ParticipantRouter.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
