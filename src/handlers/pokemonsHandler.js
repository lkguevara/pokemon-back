const getPokemons = (req, res) => {
    const { name } = req.query
    if(name) {
        res.send(`Quiero buscar los que se llamen ${name}`)
    }else {
        res.send(`Quiero enviar todos los usuarios`)
    }
}

const getPokemonsId = (req, res) => {
    const {id} = req.params
    res.send(`Detalle del pokemon bajo id: ${id}`)
}

const getPokemonsName = (req, res) => {
    const {name} = req.query
    res.send(`Detalle del pokemon bajo nombre: ${name}`)
}

const postPokemons = (req, res) => {
    const {name, image, life, attack, defense, speed, height, weight} = req.body
    res.send(`Quiero crear un pokemon con el nombre: ${name}, imagen: ${image}, vida: ${life}, ataque: ${attack}, defensa: ${defense}, velocidad: ${speed}, altura: ${height}, peso: ${weight}`)
}

module.exports = {
    getPokemons,
    getPokemonsId,
    getPokemonsName,
    postPokemons
}