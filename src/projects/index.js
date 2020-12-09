//basic imports
const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");
//defining the router for any method
const router = express.Router();
//this is basic function to read path
const readFile = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName));
  const fileContent = buffer.toString();
  return JSON.parse(fileContent);
};

router.get("/:id", (req, res) => {
  //reading the project.json
  const projectsDB = readFile("project.json");
  const project = projectsDB.filter((project) => project.ID === req.params.id);
  res.send(project);
});

router.get("/", (req, res) => {
  //reading the project.json again
  const projectsDB = readFile("projects.json");
  if (req.query && req.query.name) {
    const filteredprojects = projectsDB.filter(
      (project) =>
        project.hasOwnProperty("title") &&
        project.name.toLowerCase() === req.query.name.toLowerCase()
    );
    res.send(filteredprojects);
  } else {
    res.send(projectsDB);
  }
});

router.post(
  "/",
  [
    check("Name")
      .exists()
      .withMessage("Just assign a name man cmon brah fight me brah"),
  ],
  (req, res) => {
    //reading the project.json again
    const projectsDB = readFile("projects.json");
    const newproject = {
      ...req.body,
      ID: uniqid(),
      modifiedAt: new Date(),
    };

    projectsDB.push(newproject);

    fs.writeFileSync(
      path.join(__dirname, "projects.json"),
      JSON.stringify(projectsDB)
    );

    res.status(201).send({ id: newproject.ID });
  }
);

router.delete("/:id", (req, res) => {
  //reading the project.json
  const projectsDB = readFile("projects.json");
  //remakin the project.json without the choosen ID
  const newDb = projectsDB.filter((project) => project.ID !== req.params.id);
  fs.writeFileSync(
    path.join(__dirname, "projects.json"),
    JSON.stringify(newDb)
  );

  res.status(204).send();
});

router.put("/:id", (req, res) => {
  //reading the project.json
  const projectsDB = readFile("projects.json");
  const newDb = projectsDB.filter((project) => project.ID !== req.params.id);

  const modifiedproject = {
    ...req.body,
    ID: req.params.id,
    modifiedAt: new Date(),
  };

  newDb.push(modifiedproject);
  fs.writeFileSync(
    path.join(__dirname, "projects.json"),
    JSON.stringify(newDb)
  );

  res.send({ id: modifiedproject.ID });
});
module.exports = router;
