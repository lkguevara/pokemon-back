const axios = require ('axios')
const { Pokemon, Type } = require('../db.js')


const getAllPokemons = async (req, res) => {
    const { createBy } = req.query

    try {
// Parte 1. traer todos los pokemons de la api
      // traigo los 40 primeros pokemons
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=40');
      const pokeApi = response.data.results
      // console.log(pokeApi)

      // traer los pokemons con la propiedades id, name, image, types, life, attack, defense
      const pokeDetails = await Promise.all(
        pokeApi.map(async (pokemon) => {
          const result = await axios.get(pokemon.url)
          return {
            id: result.data.id,
            name: result.data.name,
            image: result.data.sprites.other.dream_world.front_default,
            types: result.data.types.map(type => type.type.name),
            life: result.data.stats[0].base_stat,
            attack: result.data.stats[1].base_stat,
            defense: result.data.stats[2].base_stat
          }
        })
      )
      console.log(pokeDetails)

// Parte 2. Traer los pokemons de la base de datos

      const dbData = await Pokemon.findAll({
        include: [
          {
            model: Type,
            as: 'Types',
            attributes: ['name'],
          },
        ],   
    });
      const pokeDb = dbData.map(e => e.dataValues) // me devuelve un array de objetos con los datos de la base de datos
      console.log(pokeDb)

// Parte 3. Unir los pokemons de la api con los de la base de datos
      const pokeAll = pokeDetails.concat(pokeDb)
      console.log(pokeAll)

// Parte 4. Condicional para filtrar por createBy
      if (createBy === 'dataBase') {
        res.status(200).send(pokeDb.length ? pokeDb : 'No hay pokemons en la base de datos')
      } else if (createBy === 'db') {
        res.status(200).send(pokeDetails.length ? pokeDetails : 'No hay pokemons en la api')
      } else {
        res.status(200).send(pokeAll)
      }
  }
    catch (error) {
      console.error(error);
      res.status(400).json({error: error.message});
    }
}


const getPokemonId = async (req, res) => {

}


const getPokemonName = async (req, res) => {

}


const postPokemons = async (req, res) => {

}



module.exports = {
    getAllPokemons,
    getPokemonId,
    getPokemonName,
    postPokemons
}

