const { Router } = require('express');
const pokemonsRouter = Router();

const {
    getPokemons, 
    getPokemonsId, 
    getPokemonsName, 
    postPokemons
} = require("../handlers/pokemonsHandler")


pokemonsRouter.get("/", getPokemons);

pokemonsRouter.get("/:id", getPokemonsId)

pokemonsRouter.get("/pokemonsName", getPokemonsName)

pokemonsRouter.post("/", postPokemons)

module.exports = pokemonsRouter