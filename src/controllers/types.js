const { Pokemon, Type } = require('../db.js')
const axios = require('axios')

const getAllTypes = async (req, res) => {
    try {
        const pokeType = await axios.get(`https://pokeapi.co/api/v2/type/`)
        const pokeTypeApi = pokeType.data.results
        // console.log(pokeTypeApi )

        // se va a mapear todos los tipos de pokemons que hay en la api
        const pokemonsTypes = pokeTypeApi.map(t => t.name)
        console.log(pokemonsTypes)

        // se va a crear un array con los tipos de pokemons que hay en la api a la base de datos
        pokemonsTypes.forEach(async (type) => {
            Type.findOrCreate({
                where: {
                    name: type
                }
            })
        })
        res.status(200).send(pokemonsTypes)


    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }

}   

module.exports = {
    getAllTypes
}
