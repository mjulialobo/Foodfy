const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const {
  hash
} = require('bcryptjs')

module.exports = {
  loginForm(req, res) {

    return res.render('admin/session/login.njk')
  },
  login(req, res) {
    req.session.userId = req.user.id
    req.session.isAdmin = req.user.is_admin

    return res.redirect('profile')

  },
  logout(req, res) {
    req.session.destroy()

    return res.redirect('/')
  },
  forgotForm(req, res) {
    return res.render('admin/session/forgot-password.njk')
  },
  async forgot(req, res) {

    try {

      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      })

      const token = crypto.randomBytes(20).toString('hex')

      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchstore.com.br',
        subject: 'Recuperação de senha',
        html: `
            <h2>Perdeu as chaves?</h2>
        <p>Não se preocupe, clique no link abaixo para recuperar sua senha.</p>
        <p>
          <a href='http://localhost:3000/admin/users/password-reset?token=${token}' target='_blank'>
            RECUPERAR SENHA
          </a>
        </p>

      `
      })
      
      return res.render('admin/session/recover-sent-success.njk')
    } catch (err) {
      console.error(err)
      return res.render('admin/session/forgot-password.njk', {
        error: 'Ocorreu algum erro.'
      })
    }
  },
  async resetForm(req, res) {
    return res.render('admin/session/password-reset.njk', {
      token: req.query.token
    })
  },
  async reset(req, res) {

    const user = req.user

    const {
      password,
      token
    } = req.body

    try {

      const newPassword = await hash(password, 8)

      await User.update(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: '',
      })

      return res.render('admin/session/new-password-success.njk', {
        user: req.body,
      })

    } catch (err) {
      console.error(err)
      return res.render('admin/session/password-reset', {
        user: req.body,
        token,
        error: 'Ocorreu algum erro.'
      })
    }
  }
}