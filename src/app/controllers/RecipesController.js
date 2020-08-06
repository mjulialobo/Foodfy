const { date } = require("../../lib/utils")
const Recipe = require('../../models/Recipe')
const File = require('../../models/File')

module.exports = {
    async index(req, res) {
        try {
            let { filter, page, limit } = req.query

            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = { filter, page, limit, offset }

            const recipes = await Recipe.paginate(params)
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page
            }

            if (!recipes) return res.send("Receita não encontrada!")

            async function getImage(recipeId) {
                let results = await Recipe.recipeFiles(recipeId)
                results = results.map(recipe => `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`)

                return results[0]
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id)


                return recipe
            })

            const eachRecipe = await Promise.all(recipesPromise)

            return res.render('admin/recipes/recipes', { recipes: eachRecipe, filter, pagination })

        } catch (err) {
            console.log(err)
        }
    },
    async create(req, res) {
        try {
            let results = await Recipe.allChefs()
            const chefs = results.rows

            return res.render('./admin/recipes/create', { chefs })
        } catch (err) {
            console.log(err)
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == '') return res.send('Please, fill and the fields.')
            }

            let results = await Recipe.create(req.body)
            const recipeId = results.rows[0].id

            const filePromises = req.files.map(file => File.createRecipeFiles({...file, recipe_id: recipeId }))
            await Promise.all(filePromises)

            res.redirect(`/admin/recipes/${recipeId}`)
        } catch (err) {
            console.log(`ERRO => ${err}`)
        }
    },
    async show(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results[0]
            const chef = results

            if (!recipe) {
                res.send('Recipe not found.')
            }

            results = await Recipe.files(recipe.recipe_id)
            results = results.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/recipes/show', { recipe, chef, files: results })

        } catch (err) {
            console.log(err)
        }
    },
    async edit(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results[0]
            const chefs = results

            if (!recipe) {
                res.send('Recipe not found.')
            }

            results = await Recipe.files(recipe.recipe_id)
            results = results.map(file => ({
                ...file,
                path: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/recipes/edit', { recipe, chefs, files: results })
        } catch (err) {
            console.log(err)
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files")
                    return res.send('Please, fill and the fields.')
            }

            if (req.files.length != 0) {
                const newFilePromise = req.files.map(file => File.createRecipeFiles({
                    ...file,
                    recipe_id: req.body.id
                }))

                await Promise.all(newFilePromise)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilePromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilePromise)
            }

            await Recipe.update(req.body)

            return res.redirect(`/admin/recipes/${req.body.id}`)
        } catch (err) {
            console.log(err)
        }
    },
    async delete(req, res) {
        try {
            await Recipe.delete(req.body.id)

            return res.redirect('/admin/recipes')
        } catch (err) {
            console.log(err)
        }
    }
}