const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const ChefController = require('../app/controllers/ChefController')
const FieldsValidator = require('../app/validators/fields')

const { isAdmin } = require('../app/middlewares/session')



routes.get('/', ChefController.index)
routes.get('/create', isAdmin, ChefController.create)
routes.get('/:id', ChefController.show)
routes.get('/:id/edit', isAdmin, ChefController.edit)

routes.post('/', isAdmin, FieldsValidator.isFilled, multer.array("images", 1), ChefController.post)
routes.put('/',  isAdmin, FieldsValidator.isFilled, multer.array("images", 1), ChefController.put)
routes.delete('/', isAdmin, ChefController.delete)

module.exports = routes