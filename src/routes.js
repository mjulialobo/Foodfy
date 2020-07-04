const express = require('express')
const routes = express.Router()
const clients = require('./app/controllers/general');
const recipes = require('./app/controllers/admin')


//general
routes.get('/', clients.home);
routes.get('/about', clients.about);
routes.get('/recipes', clients.recipes);
routes.get('/recipe/:id', clients.details);


//admin
routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create);
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);
routes.post("/admin/recipes", recipes.post);
routes.put("/admin/recipes", recipes.put);
routes.delete("/admin/recipes", recipes.delete);

module.exports = routes