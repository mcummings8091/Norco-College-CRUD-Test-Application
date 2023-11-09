const Item = require("../models/portfolio_item");

/* Create Handling */

exports.getCreateForm = (req, res) => {
  res.render("portfolio_create");
};

exports.createProject = (req, res, db) => {
  const skillsArray = req.body.skills.split(",");
  const projectData = new Item({
    title: req.body.title,
    description: req.body.description,
    skills: skillsArray,
  });

  // Insert the project data into the projectData table
  const sql =
    "INSERT INTO projectData (Title, Description, Skills) VALUES (?, ?, ?)";
  const values = [
    projectData.title,
    projectData.description,
    projectData.skills.join(","), // Convert the array back to a comma-separated string
  ];

  db.run(sql, values, function (err) {
    if (err) {
      console.error("Error:", err);
      res.status(500).send(err);
    }
    console.log("Project data saved!");
    res.redirect("/");
  });
};
/*
    db.get(selectQuery, [insertedId], (err) => {
      if (err) {
        console.error("Error:", err);
      } else {
        res.render("results", {
          projectData: projectData,
          skills: skillsArray,
        });
      }
    });
    */

/* End Create Handling */

/* Read Handling */

exports.getProjects = (req, res, db) => {
  const sql = "SELECT * FROM projectData";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error:", err);
    } else {
      res.render("portfolio_list", { projectData: rows });
    }
  });
};

/* End Read Handling */

/* Update Handling */

exports.getUpdateForm = (req, res) => {
  res.render("portfolio_update");
};

exports.updateProject = (req, res, db) => {
  let sql = `UPDATE projectData SET `;
  let columns = [];
  let values = [];

  if (req.body.name) {
    columns.push("Title = ?");
    values.push(req.body.title);
  }

  if (req.body.description) {
    columns.push("Description = ?");
    values.push(req.body.description);
  }

  if (columns.length > 0) {
    sql += columns.join(", ");
    sql += ` WHERE Title = ?`;
    values.push(req.body.title);

    db.run(sql, values, function (err) {
      if (err) {
        console.error("Error:", err);
      }
      console.log(`Row(s) updated: ${req.body.title}`);
      res.redirect("/");
    });
  } else {
    res.status(400).send("No fields to update");
  }
};

/* End Update Handling */

/* Delete Handling */

exports.getDeleteForm = (req, res) => {
  res.render("portfolio_delete");
};

exports.deleteProject = (req, res, db) => {
  deleteQuery = `DELETE FROM projectData WHERE Title = ?`;
  title = req.body.title;

  db.run(deleteQuery, [title], (err) => {
    if (err) {
      console.error("Project failed to delete. Error:", err);
    } else {
      console.log("Project Deleted:", title);
    }
  });
};

exports.dropTable = (req, res, db) => {
  var droptable = `DELETE FROM projectData;`;
  db.run(droptable, (err) => {
    if (err) {
      console.error("Error: ", err);
    } else {
      console.log("All rows deleted!");
    }
  });
};

/* End Delete Handling */
