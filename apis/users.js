var { Router } = require('express')
var jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
const { authenticate } = require('../utilities/middlewares');
const userRoutes = Router();

userRoutes.post('/', (req, res) => {
    let userObj = req.body;

    // store user in mongodb
    const client = new MongoClient(process.env.DB_CONNECTION_STRING)
    client.connect().then(connection => {
        console.log('connection made')
        const db = connection.db('fsd')
        db.collection('users')
            .insertOne(userObj)
            .then(x => {
                // 
                if (x.acknowledged) {
                    res.json("User Created")
                } else {
                    res.json("Something went wrong")
                }
            })
    })

});



userRoutes.patch('/', (req, res) => {
    let { _id, ...newFields } = req.body;

    const client = new MongoClient(process.env.DB_CONNECTION_STRING)
    client.connect().then(connection => {
        console.log('connection made')
        const db = connection.db('fsd')
        db.collection('users')
            .updateOne({ _id: new ObjectId(_id) }, { $set: newFields })
            .then(x => {
                // 
                if (x.acknowledged) {
                    res.json("User Updated")
                } else {
                    res.json("Something went wrong")
                }
            })
    })

})


userRoutes.get('/my-info', authenticate, (req, res) => {
    let userdata = req.headers.userdata;
    const client = new MongoClient(process.env.DB_CONNECTION_STRING)

    client.connect().then(connection => {
        console.log('connection made')
        const db = connection.db('fsd')
        db.collection('users')
            .find({ username: userdata.username })
            .toArray()
            .then(data => {
                if (data && data.length > 0) {
                    let user = data[0];
                    res.json({
                        data: user,
                        status: true
                    })
                } else {
                    res.json({
                        status: false
                    })
                }
            })
    })
})


userRoutes.get('/generate-token', (req, res) => {

    let username = req.headers.username;
    let password = req.headers.password;


    const client = new MongoClient(process.env.DB_CONNECTION_STRING)
    client.connect().then(connection => {
        console.log('connection made')
        const db = connection.db('fsd')
        db.collection('users')
            .find({ username: username, password: password })
            .toArray()
            .then(data => {
                if (data && data.length > 0) {
                    let user = data[0];
                    let token = jwt.sign({
                        username: user.username,
                        profilePicture: user.profilePicture
                    },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: process.env.TOKEN_EXPIRES_IN
                        })

                    res.json({
                        token: token
                    })
                } else {
                    res.json({
                        token: ""
                    })
                }


            })
    })




})


module.exports = { userRoutes }
