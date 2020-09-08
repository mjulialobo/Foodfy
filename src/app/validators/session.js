const User = require('../models/User')
const {
  compare
} = require('bcryptjs')

async function login(req, res, next) {

  const {
    email,
    password
  } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  }, 'users')

  if (!user) return res.render('admin/session/login', {
    user: req.body,
    error: "Usuário não encontrado!"
  })

  const passed = await compare(password, user.password)

  if (!passed) return res.render('admin/session/login', {
    user: req.body,
    error: "Senha incorreta."
  })

  req.user = user

  next()
}

async function forgot(req, res, next) {

  const {
    email
  } = req.body

  try {
    let user = await User.findOne({
      where: {
        email
      }
    })

    if (!user) return res.render('admin/session/forgot-password.njk', {
      user: req.body,
      error: 'Email não cadastrado.'
    })

    req.user = user

    next()
  } catch (err) {
    console.error(err)
  }
}

async function reset(req, res, next) {

  const {
    email,
    password,
    passwordRepeat,
    token
  } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })

  if (!user) return res.render('admin/session/password-reset.njk', {
    user: req.body,
    token,
    error: 'Usuário não cadastrado.'
  })

  if (password !== passwordRepeat) {
    return res.render('admin/session/password-reset.njk', {
      user: req.body,
      token,
      error: 'As senhas são diferentes.'
    })
  }

  if (token != user.reset_token) {
    return res.render('admin/session/password-reset.njk', {
      user: req.body,
      token,
      error: 'Token inválido. Solicite uma nova recuperação de senha.'
    })
  }
  let now = new Date()
  now = now.setHours(now.getHours())

  if (now > user.reset_token_expires) {
    return res.render('admin/session/password-reset.njk', {
      user: req.body,
      token,
      error: 'Token expirado. Solicite uma nova recuperação de senha.'
    })
  }

  req.user = user

  next()
}

module.exports = {

  login,
  forgot,
  reset

}