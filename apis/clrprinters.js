var { Router } = require("express");
var { MongoClient, ObjectId } = require("mongodb");
const clrptrRoutes = Router();

function middleware2(req, res, next) {
  console.log("middleware 2 executed....");

  next();
}

function attachSystemTime(req, res, next) {
  res.setHeader("SagarServerDate", new Date());
  next();
}

clrptrRoutes.get("/", (req, res) => {
  // database connection here
  console.log("we are in get route");
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("clrprinters")
      .find()
      .toArray()
      .then((data) => {
        return res.json(data);
      });
  });
});

clrptrRoutes.post("/", (req, res) => {
  let song = req.body;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("songs")
      .insertOne(song)
      .then((x) => {
        //
        if (x.acknowledged) {
          res.send("Song Created");
        } else {
          res.send("Something went wrong");
        }
      });
  });
});

clrptrRoutes.delete("/", (req, res) => {
  let id = req.query.id; // read id as a string
  //logic to delete song with this id from the array

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("songs")
      .deleteOne({ _id: new ObjectId(id) })
      .then((x) => {
        res.send("Song Deleted.");
      });
  });
});

clrptrRoutes.put("/", (req, res) => {
  let id = req.query.id;
  let newSongData = req.body;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("songs")
      .updateOne({ _id: new ObjectId(id) }, { $set: newSongData })
      .then((x) => {
        res.send("record updated.");
      });
  });
});

module.exports = { clrptrRoutes };
