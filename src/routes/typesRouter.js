const { Router } = require('express');
const typesRouter = Router();

const { getAllTypes } = require("../controllers/types")

typesRouter.get("/", getAllTypes)

module.exports = typesRouter