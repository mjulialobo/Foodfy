const express = require('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')
const FieldsValidator = require('../app/validators/fields')

const {
  onlyUsers,
  isLoggedRedirectToProfile,
  isAdmin
} = require('../app/middlewares/session')

routes.get('/login', isLoggedRedirectToProfile, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', onlyUsers, SessionController.logout)

routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

routes.get('/profile', onlyUsers, UserController.profile)
routes.get('/create', onlyUsers, isAdmin, UserController.create)
routes.get('/:id', onlyUsers, isAdmin,UserController.show)

routes.get('/', onlyUsers, UserController.list) 
routes.post('/', onlyUsers, isAdmin, FieldsValidator.isFilled, UserValidator.emailVerification, UserController.post) 
routes.put('/', onlyUsers, UserValidator.isItMeIsAdminVerification, UserValidator.putPasswordMatch, FieldsValidator.isFilled, UserController.put)
routes.delete('/', onlyUsers, isAdmin, UserController.delete)

module.exports = routes