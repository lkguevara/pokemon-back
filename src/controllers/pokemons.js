const axios = require ('axios')
const { Pokemon, Type } = require('../db.js')

// * Obteniendo todos los pokemons
const getAllPokemons = async (req, res) => {
    const { createBy } = req.query

    try {
//* Parte 1. traer todos los pokemons de la api
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=40');
      const pokeApi = response.data.results
      // console.log(pokeApi)
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
      // console.log(pokeDetails)

//* Parte 2. Traer los pokemons de la base de datos
    const dbData = await Pokemon.findAll({
    // incluye el modelo type y sus atributos para poder relacionarlos con el pokemon
        include: [
          {
            model: Type,
            attributes: ['name'],
            // comprobación que se realiza para que se traiga unicamente el atributo name
            through: {
              attributes: []
            }
          },
        ],   
     });
    // Traer la informacion de la base de datos. El dataValues son los datos de la api dentro de la base de datos
    const pokeDb = dbData.map(e => e.dataValues) 
    // console.log(pokeDb) 

// Parte 3. Unir los pokemons de la api con los de la base de datos
      const pokeAll = pokeDetails.concat(pokeDb)
      // console.log(pokeAll)

//* Parte 4. Condicional para filtrar por createBy
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

// * Obteniendo un pokemon por id
const getPokemonId = async (req, res) => {
  const { id } = req.params

  try {
    if(id.includes('-')) {
      const pokeFromDb = await Pokemon.findByPk(id,{
        include: [
          {
            model: Type,
            attributes: ['name'],
          },
        ],
      })
      const pokemonDb = {
        id: pokeFromDb.id,
        name: pokeFromDb.name,
        image: pokeFromDb.image,
        types: pokeFromDb.types.map(type => type.name),
        life: pokeFromDb.life,
        attack: pokeFromDb.attack,
        defense: pokeFromDb.defense,
        speed: pokeFromDb.speed,
        height: pokeFromDb.height,
        weight: pokeFromDb.weight,
      }
      res.status(200).send(pokemonDb)

    } else {
      const response = await 
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      const pokemonApi = response.data
      const pokemonID = {
        id: pokemonApi.id,
        name: pokemonApi.name,
        image: pokemonApi.sprites.other.dream_world.front_default,
        types: pokemonApi.types.map(type => type.type.name),
        life: pokemonApi.stats[0].base_stat,
        attack: pokemonApi.stats[1].base_stat,
        defense: pokemonApi.stats[2].base_stat,
        speed: pokemonApi.stats[5].base_stat,
        height: pokemonApi.height,
        weight: pokemonApi.weight,
      }
      res.status(200).send(pokemonID)
    }  
  }
  catch (error) {
    console.error(error);
    res.status(400).json({error: error.message});
  }

} 

// * Obteniendo un pokemon por nombre
const getPokemonName = async (req, res) => {
  const { pokeName } = req.query
 
  try {
    let pokeNameAll = await getAllPokemons()

    if (pokeName){
      let pokemonName = await pokeNameAll.filter (e => e.pokeName.toLowerCase.includes(pokeName.toLowerCase))
      pokemonName.length ? res.status(200).send(pokemonName) : res.stats(400).send("Pokemon no existe")
    }
    else{
      res.status(200).send(pokeNameAll)
    }
  }
  catch (error){
    console.error(error);
    res.status(400).json({error: error.message});
  }

}

// * Creando un pokemon
const postPokemons = async (req, res) => {
  // propiedades que se van a recibir del body
  const {
    name,
    image,
    life,
    attack,
    defense,
    createDb,
    type
  } = req.body;

  try {
    // crear el pokemon con los datos recibidos
    let pokemonCreated = await Pokemon.create({
      name,
      image,
      life,
      attack,
      defense,
      createDb
    })
    // no se le pasa el type porqué se debe realizar la relación aparte

    // Agregar los tipos al pokemon
    let pokemonType = await Type.findAll({
      where: {
        name: type
      }
    })

    pokemonCreated.addType(pokemonType)
    res.send('personaje creado con éxito')
  
  }

  catch (error) {
    console.error(error);
    res.status(400).json({error: error.message});
  }
}




module.exports = {
    getAllPokemons,
    getPokemonId,
    getPokemonName,
    postPokemons
}

