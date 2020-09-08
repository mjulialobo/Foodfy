const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Chef = require('../models/Chef')

const helper = require("../helpers/index")

module.exports = {

  async listAll(req, res) {

    let recipesList = await helper.createRecipesList()    

    return res.render("admin/recipes/list.njk", {
      recipes: recipesList,
    })
  },
  async listMyRecipes(req, res) {

    let recipesList = await helper.createRecipesList()

    recipesList = recipesList.filter(recipe => recipe.user_id == req.session.userId)

    return res.render("admin/recipes/list.njk", {
      recipes: recipesList,
    })
  },
  async create(req, res) {

    let chefsList = await Chef.findAll()

    res.render('admin/recipes/create', {
      chefsList
    })
  },
  async post(req, res) {

    File.init({
      table: 'files'
    })

    const filesPromise = req.files.map(file => File.create({
      name: file.filename,
      path: `/images/${file.filename}`
    }))

    const filesIds = await Promise.all(filesPromise)

    let recipe = {
      user_id: req.session.userId,
      chef_id: req.body.chefId,
      title: req.body.title,
      ingredients: req.body.ingredients.toString(),
      preparation: req.body.preparation.toString(),
      information: req.body.information
    }

    const recipeId = await Recipe.create(recipe)

    File.init({
      table: 'recipe_files'
    })

    const relationPromise = filesIds.map(id => File.create({
      recipe_id: recipeId,
      file_id: id
    }))

    await Promise.all(relationPromise)

    return res.redirect(`/admin/recipes/${recipeId}/edit`)
  },
  async show(req, res) {
    try {

      const error = req.session.error
      req.session.error = ""

      const success = req.session.success
      req.session.success = ""

      const recipeId = req.params.id

      let recipe = await Recipe.findOne(recipeId)

      if (!recipe) return res.send('Recipe not found!')

      recipe.ingredients = recipe.ingredients.split(',')
      recipe.ingredients = recipe.ingredients.filter(function (item) {
        return item !== ''
      })
      recipe.preparation = recipe.preparation.split(',')
      recipe.preparation = recipe.preparation.filter(function (item) {
        return item !== ''
      })

      let files = await Recipe.files(recipeId)

      recipe = {
        ...recipe,
        files
      }

      return res.render(`admin/recipes/show`, {
        recipe,
        error,
        success
      })
    } catch (err) {
      console.error(err)
    }
  },
  async edit(req, res) {

    try {
      let recipe = await Recipe.findOne(req.params.id)

      if (!recipe) return res.send('Recipe not found!')

      recipe.ingredients = recipe.ingredients.split(',').filter(function (item) {
        return item != ''
      })
      recipe.preparation = recipe.preparation.split(',').filter(function (item) {
        return item != ''
      })

      let files = await Recipe.files(req.params.id)

      recipe = {
        ...recipe,
        files
      }

      let chefsList = await Chef.findAll()

      res.render('admin/recipes/edit', {
        recipe,
        chefsList
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

        const filesIds = await Promise.all(newFilesPromise)

        File.init({
          table: 'recipe_files'
        })
        const relationPromise = filesIds.map(id => File.create({
          recipe_id: req.body.id,
          file_id: id
        }))

        await Promise.all(relationPromise)
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",") 
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1) 

        const removedFilesPromise = removedFiles.map(id => File.delete(id))

        await Promise.all(removedFilesPromise)
      }

      const values = {
        title: req.body.title,
        chef_id: req.body.chefId,
        ingredients: req.body.ingredients.toString(),
        preparation: req.body.preparation.toString(),
        information: req.body.information,

      }

      await Recipe.update(id, values)

      req.session.success = 'Receita alterada com sucesso!'

      return res.redirect(`/admin/recipes/${req.body.id}`)
    } catch (err) {
      console.error(err)
    }
  },
  async delete(req, res) {
    try {

      await Recipe.delete(req.body.id)

      return res.redirect('/admin/recipes')
    } catch (err) {
      console.error(err)

    }
  }
}