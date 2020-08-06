const { date } = require("../../lib/utils.js")
const Chef = require('../../models/Chef')
const File = require('../../models/File')
const Recipe = require('../../models/Recipe')
const { recipeFiles } = require("../../models/Recipe")

module.exports = {
    async index(req, res) {
        try {
            let { filter, page, limit } = req.query
            page = page || 1
            limit = limit || 8
            let offset = limit * (page - 1)

            const params = { filter, page, limit, offset }

            const chefs = await Chef.paginate(params)
            const pagination = {
                total: Math.ceil(chefs[0].total / limit),
                page
            }

            if (!chefs) return res.send("Chef not found")

            async function getImage(chefId) {
                let results = await Chef.findFile(chefId)

                return results.path
            }

            const chefPromises = chefs.map(async chef => {
                chef.image = await getImage(chef.id)
                chef.image = `${req.protocol}://${req.headers.host}${chef.image.replace("public", "")}`

                return chef
            })
            const chefImage = await Promise.all(chefPromises)

            return res.render('admin/chefs/chefs', { chefs: chefImage, filter, pagination })
        } catch (err) {
            console.log(err)
        }
    },
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)
                //validation
            for (key of keys) {
                //same as using req.body.avatar_url
                if (req.body[key] == "") {
                    return res.send('Por favor, preencha todos os campos.')

                }
            }
            if (req.files.length == 0)
                return res.send("Selecione pelo menos uma imagem")

            const filePromise = req.files.map(file => File.create({...file }))
            let results = await filePromise[0]
            const fileId = results.rows[0].id

            results = await Chef.create(req.body, fileId)
            const chefId = results.rows[0].id

            return res.redirect(`/admin/chefs/${chefId}`)
        } catch (err) {
            console.log(err)
        }
    },
    async show(req, res) {
        try {
            const chefId = req.params.id
            let chef = await Chef.find(chefId)

            if (!chef) return res.send("Chef not found")

            const chefRecipes = await Chef.showChef(chefId)
            const recipeExist = chefRecipes[0].id
            let recipes = ""

            if (recipeExist != null) {
                async function getImage(recipeId) {
                    let results = await Recipe.files(recipeId)
                    return results[0].path
                }

                const recipePromise = chefRecipes.map(async recipe => {
                    recipe.image = await getImage(recipe.id)
                    recipe.image = `${req.protocol}://${req.headers.host}${recipe.image.replace("public", "")}`

                    return recipe
                })

                recipes = await Promise.all(recipePromise)
            }

            let chefAvatar = await Chef.findFile(chefId)
            chefAvatar.path = `${req.protocol}://${req.headers.host}${chefAvatar.path.replace("public", "")}`

            return res.render('admin/chefs/show', { chef, recipes, chefAvatar })
        } catch (err) {
            console.log(err)
        }

    },
    async edit(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results

            let avatar = await Chef.files(chef.file_id)
            avatar = avatar.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render('admin/chefs/edit', { chef, avatar })
        } catch (err) {
            console.log(err)
        }

    },

    put(req, res) {
        const keys = Object.keys(req.body)
            //validation
        for (key of keys) {
            //same as using req.body.avatar_url
            if (req.body[key] == "") {
                return res.send('Please, fill all fields.')

            }

        }
        Chef.update(req.body, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    async delete(req, res) {
        await Chef.delete(req.body.id)

        return res.redirect('/admin/chefs')
    }

}