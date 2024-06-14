var { Router } = require("express");
var { MongoClient, ObjectId } = require("mongodb");
const jobRoutes = Router();

jobRoutes.get("/", (req, res) => {
  // database connection here
  console.log("we are in get route");
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("jobfinderai");
    db.collection("jobtypes")
      .find()
      .toArray()
      .then((data) => {
        return res.json(data);
      });
  });
});

jobRoutes.post("/jobtypes", (req, res) => {
  let job = req.body;
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  res.header("Allow-Control-Allow-Origin", "*");
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("jobfinderai");
    db.collection("jobtypes")
      .insertOne(job)
      .then((x) => {
        //
        if (x.acknowledged) {
          console.log("job");
          res.send({ message: "job created" });
          // res.send("job created");
        } else {
          res.send({ message: "Something went wrong" });
        }
      });
  });
});

jobRoutes.post("/findjob", (req, res) => {
  let job = req.body.job;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("jobfinderai");
    db.collection("jobtypes")
      .findOne(job)
      .then((x) => {
        if (x.acknowledged) {
          console.log("job");
          res.send(true);
        } else {
          res.send({ message: "Something went wrong" });
        }
      });
  });
});

jobRoutes.delete("/", (req, res) => {
  let id = req.query.id; // read id as a string
  

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("jobfinderai");
    db.collection("jobtypes")
      .deleteOne({ _id: new ObjectId(id) })
      .then((x) => {
        res.send({ message: "Job Deleted." });
      });
  });
});

jobRoutes.put("/", (req, res) => {
  let id = req.query.id;
  let newJobData = req.body;

  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("jobfinderai");
    db.collection("jobtypes")
      .updateOne({ _id: new ObjectId(id) }, { $set: newJobData })
      .then((x) => {
        res.send({ message: "record updated." });
      });
  });
});

module.exports = { jobRoutes };
