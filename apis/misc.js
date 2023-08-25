var { Router } = require('express')
const miscRoutes = Router();



miscRoutes.get("/greet", (req, res) => {
    let username = req.query.myname;
    let msg = "Hi, " + username
    res.send(msg)
})

miscRoutes.get("/make-square", (req, res) => {
    let n = req.query.number
    let square = n * n;
    res.send(square.toString())
})

miscRoutes.get("/rectangle-area", (req, res) => {
    let l = req.query.sagar;
    let b = req.query.amit;
    let a = l * b;
    res.send(a.toString())
})


module.exports = { miscRoutes }
