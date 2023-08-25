const { getJsonFromFile, writeJsonToFile } = require("./utils.js");

function counterMiddleware(req, res, next) {
    let counterObj = getJsonFromFile('./counter.json')
    counterObj.counter++
    writeJsonToFile('./counter.json', counterObj)

    next();
}

module.exports = { counterMiddleware }