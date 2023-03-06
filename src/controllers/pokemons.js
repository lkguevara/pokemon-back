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
  /*
  try {
    // 1. Buscar el pokemon en la bd
    const pokeFromDb = await Pokemon.findOne({
      where: {
        name: pokeName
      },
    })

    // 2. Si se encuentra en la bd, lo envia
    if (pokeFromDb) {
      return res.json(pokeFromDb)
    }

    // 3. Si no se encuentra en la bd, busca en la api
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
    // Extraer los datos necesarios de la respuesta de la API
    const { name, sprites, types } = response.data;
    const image = sprites.other['official-artwork'].front_default;
    const type = types.map((t) => t.type.name).join(', ');

    // Crear un nuevo Pokémon con los datos obtenidos de la API
    const pokemonFromAPI = await Pokemon.create({
      name,
      type,
      image,
    });

    // Enviar el nuevo Pokémon como respuesta
    res.json(pokemonFromAPI);

    

  } catch (error) {
    console.error(error);
    res.status(400).json({error: error.message});
  }
  */

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
    createdInDb,
    types
  } = req.body;

  try {
    // validar que se reciban todos los datos
    if (!name || !image || !life || !attack || !defense ) {
      return res.status(400).send('Faltan datos');
    }
    // validar que el pokemon no exista en la base de datos
    const pokeFromDb = await Pokemon.findOne({
      where: {
        name: name
      },
    })
    if (pokeFromDb) {
      return res.status(400).send('El pokemon ya existe');
    }
    // crear el pokemon
    const newPokemon = await Pokemon.create({
      name,
      image,
      life,
      attack,
      defense,
      createdInDb,
      types
    });
    
    // Agregar los tipos al pokemon
    const typeOrTypes = await Type.findAll({
      where: {
        name: types
      }
    })
    await newPokemon.addTypes(typeOrTypes)
  

    // enviar el pokemon como respuesta
    res.status(200).send(newPokemon);


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

