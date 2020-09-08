const express = require('express')
const routes = express.Router()

const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')

const HomeController = require('../app/controllers/HomeController')

const {
  onlyUsers
} = require('../app/middlewares/session')

routes.use('/admin/users', users)
routes.use('/admin/recipes', onlyUsers, recipes)
routes.use('/admin/chefs', onlyUsers, chefs)

/* CLIENT */
routes.get('/', HomeController.index)
routes.get('/home', HomeController.home)
routes.get('/about', HomeController.about)
routes.get('/recipes', HomeController.recipes)
routes.get('/chefs', HomeController.chefs)
routes.get('/recipes/recipe/:id', HomeController.recipe)
routes.get('/chefs/chef/:id', HomeController.chef)


module.exports = routes