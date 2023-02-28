const getTypes = (req, res) => {
    const {name} = req.query
    if(name) {
        res.send(`Quiero buscar el pokemon bajo type: ${name}`)
    }else {
        res.send(`Quiero enviar todos los tipos de pokemon`)
    }

}


module.exports = {
    getTypes
    
}