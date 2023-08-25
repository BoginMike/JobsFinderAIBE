var fs = require('fs')

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function getJsonFromFile(filename) {
    let content = fs.readFileSync(filename).toString();
    return JSON.parse(content)
}

function writeJsonToFile(filename, jsonData) {
    let content = JSON.stringify(jsonData)
    fs.writeFileSync(filename, content);
}

function pushJsonToFile(filename, jsonObj) {
    let array = getJsonFromFile(filename);
    array.push(jsonObj);
    writeJsonToFile(filename, array)
}

function deleteFromJsonFile(filename, id) {
    let data = getJsonFromFile(filename)
    data = data.filter(x => x.id != id);
    writeJsonToFile(filename, data)
}

module.exports = {
    uuidv4,
    getJsonFromFile,
    writeJsonToFile,
    pushJsonToFile,
    deleteFromJsonFile
}