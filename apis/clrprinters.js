var { Router } = require("express");
var { MongoClient, ObjectId } = require("mongodb");
const clrptrRoutes = Router();

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
  let clrprinter = req.body;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("clrprinters")
      .insertOne(clrprinter)
      .then((x) => {
        //
        if (x.acknowledged) {
          res.send("clrprinter Created");
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
    db.collection("clrprinters")
      .deleteOne({ _id: new ObjectId(id) })
      .then((x) => {
        res.send("clrprinter Deleted.");
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
    db.collection("clrprinters")
      .updateOne({ _id: new ObjectId(id) }, { $set: newSongData })
      .then((x) => {
        res.send("record updated.");
      });
  });
});

module.exports = { clrptrRoutes };
