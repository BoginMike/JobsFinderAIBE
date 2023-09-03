var express = require("express");
var cors = require("cors");
var mongo = require("mongodb");
var dotenv = require("dotenv");
var { zipRoutes } = require("./apis/zips.js");
var { chatRoutes } = require("./apis/chats.js");
var { bwptrRoutes } = require("./apis/bwprinters.js");
var { clrptrRoutes } = require("./apis/clrprinters.js");
const { getJsonFromFile } = require("./utilities/utils.js");
const { userRoutes } = require("./apis/users.js");
const { postRoutes } = require("./apis/posts.js");
const { upload } = require("./utilities/grid-fs.util.js");
const { authenticate } = require("./utilities/middlewares.js");
dotenv.config();
var app = express();

app.use(express.json());
app.use(cors());

var bucket;
async function createGridStream() {
  return new Promise((resolve, reject) => {
    new mongo.MongoClient(process.env.DB_CONNECTION_STRING)
      .connect()
      .then((client) => {
        const db = client.db("copierrental");
        resolve(new mongo.GridFSBucket(db, { bucketName: "uploads" }));
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function authenticateBasic(req, res, next) {
  if (process.env.AUTH_NEEDED == "true") {
    let username = req.headers.username;
    let password = req.headers.password;

    let allValidUsers = getJsonFromFile("./users.json");

    if (
      allValidUsers.find(
        (x) => x.username == username && x.password == password
      )
    ) {
      next(); // valid user
    } else {
      res.json({ message: "request not authorized" });
      return;
    }
  } else {
    next();
  }
}

app.use("/users", userRoutes);
app.use("/zips", authenticate, zipRoutes);
app.use("/chats", authenticate, chatRoutes);
app.use("/bwprinters", authenticate, bwptrRoutes);
app.use("/clrprinters", authenticate, clrptrRoutes);
app.use("/posts", authenticate, postRoutes);

// to upload the file
app.post("/app-image-upload", upload.single("myFile"), (req, res) => {
  console.log(req.file);
  res.json(req.file);
});

// to fetch the file
app.get("/image/:filename", (req, res) => {
  bucket
    .find({ filename: req.params.filename })
    .toArray()
    .then((files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      }

      const stream = bucket.openDownloadStreamByName(req.params.filename);
      stream.pipe(res);
    });
});

app.get("/", (req, res) => {
  res.send("App working...");
});

createGridStream().then((x) => {
  bucket = x;

  app.listen(3001, () => {
    console.log("app started....");
  });
});
