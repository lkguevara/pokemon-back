const axios = require ('axios')
const { Pokemon, Type } = require('../db.js')


const getAllPokemons = async (req, res) => {
    const { createBy } = req.query

    try {
// Parte 1. traer todos los pokemons de la api
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
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
      // console.log(pokeDetails)

// Parte 2. Traer los pokemons de la base de datos
      //Obtener todos los pokemons de la base de datos
  const dbData = await Pokemon.findAll({
        //Obteniendo los types de cada pokemon
        include: [
          {
            model: Type,
            attributes: ['name'],
            through: {
              attributes: []
            }
          },
        ],   
     });
    //  Constante para mapear los datos de la base de datos
      const pokeDb = dbData.map(e => e.dataValues) 
      // console.log(pokeDb) //Consologea los pokemons de la base de datos

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


const getPokemonName = async (req, res) => {
  const { q } = req.query
  try {
    // 1. Buscar el pokemon en la bd
    const pokeFromDb = await Pokemon.findOne({
      where: {
        name: q
      },
    })

    // 2. Si se encuentra en la bd, lo envia
    if (pokeFromDb) {
      return res.json(pokeFromDb)
    }

    // 3. Si no se encuentra en la bd, busca en la api
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${q}`)
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


}


const postPokemons = async (req, res) => {
  const {
    name,
    types,
    image,
    life,
    attack,
    defense,
    speed,
    height,
    weight,
  } = req.body;

  try {
    if (
      isNaN(life) ||
      isNaN(attack) ||
      isNaN(defense) ||
      isNaN(speed) ||
      isNaN(height) ||
      isNaN(weight)
    )
      return res.status(400).json("Alguno de los datos no es un número");

    if (!name) return res.status(400).json("Es neceario el nombre");

    const existe = await Pokemon.findOne({ where: { name: name } });
    if (existe) return res.status(400).json("El pokemón ya existe");

    const newPokemon = await Pokemon.create(
      {
        name: name.toLowerCase(), // con este metodo convertimos el name en minuscula
        image: image,
        life: Number(life),
        attack: Number(attack),
        defense: Number(defense),
        speed: Number(speed),
        height: Number(height),
        weight: Number(weight),
      },
      {
        include: [Type],
      }
    );

    // Hacemos la relacion del nuevo pokemon con todos los types que llegan en el array
    const pokemonTypes = await Type.findAll({
      where: {
        name: types,
      },
    });

    await newPokemon.addtypes(pokemonTypes);

    const typeID = await Pokemon.findByPk(newPokemon.id, {
      include: [
        {
          model: Type,
          as: "types",
        },
      ],
    });

    res.status(200).send(typeID.dataValues);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, mensaje: "El pokemon ya existe" });
  }
  }




module.exports = {
    getAllPokemons,
    getPokemonId,
    getPokemonName,
    postPokemons
}

