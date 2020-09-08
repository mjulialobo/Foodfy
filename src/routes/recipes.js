const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const user = require('../app/middlewares/user')

const RecipeController = require('../app/controllers/RecipeController')
const FieldsValidator = require('../app/validators/fields')


routes.get('/', RecipeController.listAll)
routes.get('/dashboard', RecipeController.listMyRecipes)
routes.get('/create', RecipeController.create) 
routes.get('/:id', RecipeController.show) 
routes.get('/:id/edit', user.verifyEditCredentials, RecipeController.edit)

routes.post('/', FieldsValidator.isFilled, multer.array("images", 5), RecipeController.post)
routes.put('/', FieldsValidator.isFilled, multer.array("images", 5), RecipeController.put)
routes.delete('/', RecipeController.delete)

module.exports = routes