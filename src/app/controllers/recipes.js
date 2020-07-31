const { date } = require("../../lib/utils")
const Recipe = require('../../models/recipe')
const File = require('../../models/file')

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 9
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {

                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
                return res.render("admin/recipes/recipes", { recipes, pagination, filter })
            }
        }
        Recipe.paginate(params)

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
            const recipe = results.rows[0]
            const chef = results.rows


            if (!recipe) {
                res.send('Recipe not found.')
            }

            results = await Recipe.files(recipe.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/recipes/show', { recipe, chef, files })

        } catch (err) {
            console.log(err)
        }
    },
    async edit(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
            const chefs = results.rows


            if (!recipe) {
                res.send('Recipe not found.')
            }

            results = await Recipe.files(recipe.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                path: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/recipes/edit', { recipe, chefs, files })
        } catch (err) {
            console.log(err)
        }
    },
    async put(req, res) {
        try {
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