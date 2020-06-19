const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({error: 'Invalid repository id.'})

  return next();
}

function validateValues(request, response, next) {
  const { title, url, techs, likes } = request.body;
  const repository = { title, url, techs, likes };
  const method = request.method.toUpperCase()
  const errors = [];

  switch (method) {
    case "POST":
      if (title == undefined || (title != undefined && title.length == 0)) {
        errors.push("The property 'title' is required");
      }
      if (url == undefined || (url != undefined && url.length == 0)) {
        errors.push("The property 'url' is required");
      }
      break;
    case "PUT":
      if (title != undefined && title.length == 0) {
        errors.push("The property 'title' is required");
      }
      if (url != undefined && url.length == 0) {
        errors.push("The property 'url' is required");
      }
      break;
    default:
      break;
  }

  if (errors.length > 0)
    return response.status(400).json(repository);

  return next();
}

app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", validateValues, (request, response) => {
  const id = uuid();
  const { title, url, techs } = request.body;

  const repository = { id, title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateValues, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIdx = repositories.findIndex(repository => repository.id == id);

  if (repositoryIdx < 0)
    return response.status(400).json({error: 'Repository not found.'})

  const currentRepository = repositories[repositoryIdx];
  const repository = {
    id,
    title,
    url,
    techs,
    likes: currentRepository.likes
  };

  repositories[repositoryIdx] = repository;

  return response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIdx = repositories.findIndex(repository => repository.id == id);

  if (repositoryIdx < 0)
    return response.status(400).json({error: 'Repository not found.'})

  repositories.splice(repositoryIdx, 1);
  return response.json({})
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIdx = repositories.findIndex(repository => repository.id == id);

  if (repositoryIdx < 0)
    return response.status(400).json({error: 'Repository not found.'});

  const repository = repositories[repositoryIdx];
  repository.likes += 1;

  repositories[repositoryIdx] = repository;

  return response.json({likes: repository.likes })
});

module.exports = app;
