const { Router } = require('express');
const typesRouter = Router();

const { getTypes } = require("../handlers/typesHandler")

typesRouter.get("/", getTypes)

module.exports = typesRouter