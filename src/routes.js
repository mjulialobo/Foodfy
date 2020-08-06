const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const Clients = require('./app/controllers/HomeController');
const Recipes = require('./app/controllers/RecipesController')
const Chefs = require('./app/controllers/ChefsController')



//general
routes.get('/', Clients.home);
routes.get('/about', Clients.about);
routes.get('/recipes', Clients.recipes);
routes.get('/recipe/:id', Clients.details);
routes.get('/chefs', Clients.chefs);
routes.get('/chef/:id', Clients.chef);



//admin recipes
routes.get("/admin/recipes", Recipes.index);
routes.get("/admin/recipes/create", Recipes.create);
routes.get("/admin/recipes/:id", Recipes.show);
routes.get("/admin/recipes/:id/edit", Recipes.edit);

routes.post("/admin/recipes", multer.array("photos", 5), Recipes.post);
routes.put("/admin/recipes", multer.array("photos", 5), Recipes.put);
routes.delete("/admin/recipes", Recipes.delete);

//admin chefs
routes.get("/admin/chefs", Chefs.index);
routes.get("/admin/chefs/create", Chefs.create);
routes.get("/admin/chefs/:id", Chefs.show);
routes.get("/admin/chefs/:id/edit", Chefs.edit);

routes.post("/admin/chefs", multer.array("photos", 1), Chefs.post);
routes.put("/admin/chefs", multer.array("photos", 1), Chefs.put);
routes.delete("/admin/chefs", Chefs.delete);

module.exports = routes