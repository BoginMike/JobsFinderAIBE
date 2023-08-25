var { Router } = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const postRoutes = Router();

postRoutes.post('/', (req, res) => {
    let postBody = req.body;

    postBody.authorId = new ObjectId(postBody.authorId);

    const client = new MongoClient(process.env.DB_CONNECTION_STRING)
    client.connect().then(connection => {
        console.log('connection made')
        const db = connection.db('fsd')
        db.collection('posts')
            .insertOne(postBody)
            .then(x => {
                // 
                if (x.acknowledged) {
                    res.json("Post Created")
                } else {
                    res.json("Something went wrong")
                }
            })
    })
})


postRoutes.get("/", (req, res) => {
    console.log('we are in get route')
    const client = new MongoClient(process.env.DB_CONNECTION_STRING)
    client.connect().then(connection => {
        console.log('connection made')
        const db = connection.db('fsd')
        db.collection('posts')
            .aggregate([{ $lookup: { from: "users", localField: "authorId", foreignField: "_id", as: "authorInfo" } }, { $project: { authorId: false, "authorInfo.password": false } }])
            .toArray()
            .then(data => {
                return res.json(data)
            })
    })
})


module.exports = { postRoutes }