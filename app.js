const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const portfolioContoller = require("./controllers/PortfolioController");

PORT = 8080;

const app = express();
const router = express.Router();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(router);

/* Database initialization */

const db = new sqlite3.Database("projectData.db", (err) => {
  if (err) {
    console.error(err);
  }
  console.log("Connected!");
});

var createProjectTable = `
    CREATE TABLE IF NOT EXISTS projectData (
        ID INTEGER PRIMARY KEY,
        Title TEXT,
        Description TEXT,
        Skills TEXT
    );
`;

db.run(createProjectTable);

/* End Database initialization */

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/pages/index.html");
});

/* Create */

router.get("/create", portfolioContoller.getCreateForm);

router.post("/create", (req, res) =>
  portfolioContoller.createProject(req, res, db)
);

/* End Create */

/* Read */

router.get("/read", (req, res) => portfolioContoller.getProjects(req, res, db));

/* End Read */

/* Update */

router.get("/update", portfolioContoller.getUpdateForm);

router.post("/update", (req, res) =>
  portfolioContoller.updateProject(req, res, db)
);

/* End Update */

/* Delete */

router.get("/delete", portfolioContoller.getDeleteForm);

router.post("/delete", (req, res) =>
  portfolioContoller.deleteProject(req, res, db)
);

router.post("/drop", (req, res) => portfolioContoller.dropTable(req, res, db));

/* End Delete */

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
