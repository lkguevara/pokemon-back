const { Router } = require('express');
const pokemonsRouter = Router();

const {
    getAllPokemons, 
    getPokemonId, 
    getPokemonName, 
    postPokemons
} = require("../controllers/pokemons")


pokemonsRouter.get("/", getAllPokemons);

pokemonsRouter.get("/:id", getPokemonId)

pokemonsRouter.get("/pokemonsName", getPokemonName)

pokemonsRouter.post("/", postPokemons)

module.exports = pokemonsRouter