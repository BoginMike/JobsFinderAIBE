var { Router } = require("express");
var { MongoClient, ObjectId } = require("mongodb");
const zipRoutes = Router();

zipRoutes.get("/", (req, res) => {
  // database connection here
  console.log("we are in get route");
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("zips")
      .find()
      .toArray()
      .then((data) => {
        return res.json(data);
      });
  });
});

zipRoutes.post("/", (req, res) => {
  let zip = req.body;
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("zips")
      .insertOne(zip)
      .then((x) => {
        //
        if (x.acknowledged) {
          console.log("zip");
          res.send({ message: "zip created" });
          // res.send("zip created");
        } else {
          res.send({ message: "Something went wrong" });
        }
      });
  });
});

zipRoutes.post("/findZip", (req, res) => {
  let zip = req.body.zip;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("zips")
      .findOne(zip)
      .then((x) => {
        if (x.acknowledged) {
          console.log("zip");
          res.send(true);
        } else {
          res.send({ message: "Something went wrong" });
        }
      });
  });
});

zipRoutes.delete("/", (req, res) => {
  let id = req.query.id; // read id as a string
  //logic to delete song with this id from the array

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("zips")
      .deleteOne({ _id: new ObjectId(id) })
      .then((x) => {
        res.send({ message: "Zip Deleted." });
      });
  });
});

zipRoutes.put("/", (req, res) => {
  let id = req.query.id;
  let newZipData = req.body;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("zips")
      .updateOne({ _id: new ObjectId(id) }, { $set: newZipData })
      .then((x) => {
        res.send({ message: "record updated." });
      });
  });
});

module.exports = { zipRoutes };
