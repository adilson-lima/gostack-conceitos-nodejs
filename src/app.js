const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  let repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  // console.log(request.params)

  repositories.push(repository)

  response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  let repositoryIndex = repositories.findIndex(repository => repository.id.includes(id))

  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid UUID'})
  }

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Id does not exist'})
  }

  let repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  //console.log(repositoryIndex)

  repositories[repositoryIndex] = repository

  response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  if(!isUuid(id)){
    response.status(400).json({error: "UUID is not valid"})
  }

  let repositoryIndex = repositories.findIndex(repository => repository.id.includes(id))

  if(repositoryIndex < 0){
    response.status(400).json({error: 'Id does not exist'})
  }

  repositories.splice(repositoryIndex, 1)
  
  response.status(204).json()


});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params

  if(!isUuid(id)){
    response.status(400).json({error: "UUID is not valid"})
  }

  let repositoryIndex = repositories.findIndex(repository => repository.id.includes(id))

  if(repositoryIndex < 0){
    response.status(400).json({error: 'Id does not exist'})
  }

  let repository = repositories[repositoryIndex]
  repository.likes ++

  response.json(repository)

});

module.exports = app;
