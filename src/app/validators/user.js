const {
  compare
} = require('bcryptjs')

const User = require('../models/User')

async function putPasswordMatch(req, res, next) {
  try {

    req.body.id != req.session.userId ? next() : passwordVerification()

    async function passwordVerification() {
      const {
        email,
        password,
      } = req.body

      const user = await User.findOne({
        where: {
          email
        }
      })

      const passed = await compare(password, user.password)

      if (!passed) {
        req.session.error = 'Senha incorreta!'
        return res.redirect('/admin/users/profile')
      }

      next()
    }

  } catch (err) {
    console.error(err)
  }
}

async function isItMeIsAdminVerification(req, res, next) {

  try {
    function itsNotUser() {

      req.session.error = 'Desculpe! Apenas administradores podem realizar essa ação.'
      return res.redirect('/admin/users/profile')
    }

    (req.body.id == req.session.userId) ? next():
      req.session.isAdmin == true ? next() :
      itsNotUser()
  } catch (err) {
    console.error(err)
  }
}

async function emailVerification(req, res, next) {
  const {
    email,
  } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })

  if (user) {
    req.session.error = 'Este endereço de e-mail já está sendo utilizado por outro usuário.'
    req.session.user = user
    return res.redirect('/admin/users/create')
  }

  next()
}

module.exports = {
  isItMeIsAdminVerification,
  putPasswordMatch,
  emailVerification
}