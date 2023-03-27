const express = require("express");
const { connect } = require("./dbConnection");
const controller = require("./controllers/controller");
const validator = require("./controllers/validator");
const { upload, fileSizeError } = require("./fileHandler");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
app.use("/avatar", express.static("avatar"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.errorMsg = req.fileUploadError;
  next();
});

app.get("/", controller.getIndex);

app.get("/add", controller.getAdd);

app.post("/add", upload.single("avatar"), fileSizeError, validator.postAdd, controller.postAdd);

app.get("/edit", controller.getEdit);

app.post("/edit", upload.single("avatar"), fileSizeError, validator.postAdd, controller.postEdit);

app.post("/delete", controller.postDelete);

app.get("/all-records", controller.getAllRecords);

app.get("/deleteAll", controller.postDeleteAll);

app.get("/search", controller.getSearch);

app.use("*", (req, res) => {
  res.render("page404");
});

app.use((error, req, res, next) => {
  console.log(error);
  res.render("globalErrorHandler");
});

app.listen(3000, async () => {
  const db = await connect();
  console.log("Server is up on port 3000");
});
