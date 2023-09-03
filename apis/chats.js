var { Router } = require("express");
var { MongoClient, ObjectId } = require("mongodb");
const chatRoutes = Router();

chatRoutes.get("/", (req, res) => {
  // database connection here
  console.log("we are in get route");
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("chats")
      .find()
      .toArray()
      .then((data) => {
        return res.json(data);
      });
  });
});

chatRoutes.post("/", (req, res) => {
  let chat = req.body;
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("chats")
      .insertOne(chat)
      .then((x) => {
        //
        if (x.acknowledged) {
          console.log("chat");
          res.send("chat created");
        } else {
          res.send("Something went wrong");
        }
      });
  });
});

chatRoutes.post("/findChat", (req, res) => {
  let chat = req.body.chatp;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("chats")
      .findOne(chat)
      .then((x) => {
        if (x.acknowledged) {
          console.log("chat");
          res.send(true);
        } else {
          res.send("Something went wrong");
        }
      });
  });
});

chatRoutes.delete("/", (req, res) => {
  let id = req.query.id; // read id as a string
  //logic to delete song with this id from the array

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("chats")
      .deleteOne({ _id: new ObjectId(id) })
      .then((x) => {
        res.send("Chat Deleted.");
      });
  });
});

chatRoutes.put("/", (req, res) => {
  let id = req.query.id;
  let newChatData = req.body;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("copierrental");
    db.collection("chats")
      .updateOne({ _id: new ObjectId(id) }, { $set: newZipData })
      .then((x) => {
        res.send("record updated.");
      });
  });
});

module.exports = { chatRoutes: chatRoutes };
