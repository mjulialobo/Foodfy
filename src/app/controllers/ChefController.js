const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

module.exports = {
  async index(req, res) {
    try {
      let chefs = await Chef.findAll()


      return res.render("admin/chefs/chefs", {
        chefs
      })
    } catch (err) {
      console.error(err)

    }
  },
  create(req, res) {
    res.render('admin/chefs/create')
  },
  async post(req, res) {
    try {
     
      File.init({
        table: 'files'
      })

      const file = req.files

      const filesPromise = file.map(file => File.create({
        name: file.filename,
        path: `/images/${file.filename}`
      }))

      let fileId = await Promise.all(filesPromise)
      
      let values = {
        name: req.body.name,
        file_id: JSON.parse(fileId)
      }

      let chefId = await Chef.create(values)

      
      return res.redirect(`/admin/chefs/${chefId}`)

    } catch (err) {
      console.error(err)
    }
  },
  async show(req, res) {
    try {
      const error = req.session.error
      req.session.error = ''

      const chefId = req.params.id

      let chef = await Chef.findOne(chefId)

      if (!chef) return res.send('Chef not found!')

      const chefRecipes = await Chef.findChefRecipes(chefId)

      async function getImage(recipeId) {
        let results = await Recipe.files(recipeId)

        return results[0]
      }

      const recipesPromise = chefRecipes.map(async recipe => {
        recipe.file = await getImage(recipe.id)

        return recipe
      })

      const recipesList = await Promise.all(recipesPromise)

      const file = await Chef.files(chefId)

      chef = {
        ...chef,
        file: file[0],
      }

      return res.render('admin/chefs/show', {
        chef,
        recipes: recipesList,
        error
      })
    } catch (err) {
      console.error(err)
    }
  },
  async edit(req, res) {
    try {

      const chefId = req.params.id

      let chef = await Chef.findOne(chefId)

      if (!chef) {
        return res.send('Chef not found!')
      }

      const files = await Chef.files(chefId)


      return res.render(`admin/chefs/edit`, {
        chef,
        files
      })
    } catch (err) {
      console.error(err)
    }
  },
  async put(req, res) {
    try {

      const {
        id
      } = req.body

      if (req.files.length != 0) {
        File.init({
          table: 'files'
        })
        const newFilesPromise = req.files.map(file => File.create({
          name: file.filename,
          path: `/images/${file.filename}`
        }))

        let fileId = await Promise.all(newFilesPromise)

        let values = {
          name: req.body.name,
          file_id: JSON.parse(fileId),
        }

        await Chef.update(id, values)

        await File.delete(req.body.file_id)

        return res.redirect(`/admin/chefs/${req.body.id}`)
      }

      let values = {
        name: req.body.name,
      }

      await Chef.update(id, values)

      return res.redirect(`/admin/chefs/${req.body.id}`)
    } catch (err) {
      console.error(err)

    }
  },
  async delete(req, res) {
    try {

      await Chef.delete(req.body.id)

      return res.redirect('/admin/chefs')
    } catch (err) {
      console.error(err)
    }
  }
}