var { Router } = require('express')
var { uuidv4, pushJsonToFile, deleteFromJsonFile, getJsonFromFile, writeJsonToFile } = require('../utilities/utils.js');
const { counterMiddleware } = require('../utilities/counterMiddleware.js');
const recpRoutes = Router();

recpRoutes.get('/', counterMiddleware, (req, res) => {
    let data = getJsonFromFile('./recipes.json')
    res.json(data)
})

recpRoutes.post("/", (req, res) => {
    let recipe = req.body;
    recipe["id"] = uuidv4()

    pushJsonToFile('./recipes.json', recipe)

    res.send("recipe Created")
})

recpRoutes.delete('/', (req, res) => {
    let id = req.query.id;
    //logic to delete recipe with this id from the array
    deleteFromJsonFile('./recipes.json', id)

    res.send("recipe Deleted")
})

recpRoutes.put('/', (req, res) => {
    let id = req.query.id;
    let newData = req.body;

    // get the old recipe and update with new values;
    let data = getJsonFromFile('./recipes.json')
    for (const oldrecipe of data) {
        if (oldrecipe.id == id) {
            oldrecipe.recipeName = newData.recipeName;
            oldrecipe.description = newData.description;
        }
    }

    writeJsonToFile('./recipes.json', data)

    res.send("recipe updated.")
})


module.exports = { recpRoutes }
