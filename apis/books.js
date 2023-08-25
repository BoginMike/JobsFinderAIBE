var { Router } = require("express");

const booksRoutes = Router();
var { MongoClient, ObjectId } = require("mongodb");

booksRoutes.get("/", (req, res) => {
  //
  //we will get pageNumber and PageSize from query params

  let pageNumber = Number(req.query.pageNumber);
  let pageSize = req.query.pageSize
    ? Number(req.query.pageSize)
    : Number(process.env.PAGE_SIZE || 10);

  let skipCount = (pageNumber - 1) * pageSize;
  let limitCount = pageSize;

  //mongoDb Query
  const client = new MongoClient(process.env.DB_CONNECTION_STRING);
  client.connect().then((connection) => {
    console.log("connection made");
    const db = connection.db("fsd");
    db.collection("books")
      .aggregate([{ $count: "count" }])
      .toArray()
      .then((x) => {
        // let totalCount = x[0].count;
        let totalCount = 10;

        db.collection("books")
          .aggregate([{ $skip: skipCount }, { $limit: limitCount }])
          .toArray()
          .then((data) => {
            return res.json({
              pageSize,
              pageNumber,
              data,
              totalCount,
            });
          });
      });
  });
});

module.exports = { booksRoutes };
