var { Router } = require("express");
var { MongoClient, ObjectId } = require("mongodb");
const bwptrRoutes = Router();

bwptrRoutes.get("/", (req, res) => {
  // database connection here
  console.log("we are in get route");
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("printers")
      .find()
      .toArray()
      .then((data) => {
        return res.json(data);
      });
  });
});

bwptrRoutes.post("/", (req, res) => {
  let ptr = req.body;
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("printers")
      .insertOne(ptr)
      .then((x) => {
        //
        if (x.acknowledged) {
          res.send("ptr Created");
        } else {
          res.send("Something went wrong");
        }
      });
  });
});

bwptrRoutes.delete("/", (req, res) => {
  let id = req.query.id; // read id as a string
  //logic to delete ptr with this id from the array

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("printers")
      .deleteOne({ _id: new ObjectId(id) })
      .then((x) => {
        res.send("ptr Deleted.");
      });
  });
});

bwptrRoutes.put("/", (req, res) => {
  let id = req.query.id;
  let newSongData = req.body;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("printers")
      .updateOne({ _id: new ObjectId(id) }, { $set: newPtrData })
      .then((x) => {
        res.send("record updated.");
      });
  });
});

module.exports = { bwptrRoutes };
