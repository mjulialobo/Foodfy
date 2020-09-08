function onlyUsers(req, res, next) {
  
  if(!req.session.userId)
    return res.redirect('/admin/users/login')

  next()
}

function isLoggedRedirectToProfile(req, res, next) {
  
  if(req.session.userId)
    return res.redirect('/admin/users/profile')

  next()
}

function isAdmin (req, res, next) {

  if(!req.session.isAdmin) {
    req.session.error = 'Desculpe! Apenas administradores podem acessar essa funcionalidade.'
    return res.redirect(`${req.headers.referer}`)
  }

  next()
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToProfile,
  isAdmin
}