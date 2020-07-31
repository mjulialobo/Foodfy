const { date } = require("../../lib/utils.js")
const Chef = require('../../models/chef')
const File = require('../../models/file')
const Recipe = require('../../models/recipe')
const { recipeFiles } = require("../../models/recipe")

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 12
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(chefs) {

                const pagination = {
                    total: Math.ceil(chefs[0].total / limit),
                    page
                }
                return res.render("admin/chefs/chefs", { chefs, pagination, filter })
            }
        }
        Chef.paginate(params)
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
        //get chefs and chefs images//

        let results = await Chef.showChef(req.params.id)
        const chef = results.rows[0]
        const recipes = results.rows
        const totalRecipes = results.rowCount


        let Files = await File.showFiles(chef.file_id)
        const files = Files.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        let RecipeFiles = await File.showRecipeFiles(recipes.id)
        const recipe_files = RecipeFiles.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))



        //condition for chefs with or without recipes//

        if (chef.id == null) {
            let totalRecipes = 0

            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
            const chefId = results.rows[0].id

            if (!chef) return res.send("Chef não encontrado!")

            return res.render("admin/chefs/show", { chef, totalRecipes, chefId, files })

        } else {
            if (!chef) return res.send("Chef não encontrado!")

            return res.render("admin/chefs/show", { chef, recipes, totalRecipes, files, recipe_files })
        }

    },
    async edit(req, res) {

        let results = await Chef.showChef(req.params.id)
        const chef = results.rows[0]
        const recipes = results.rows
        const totalRecipes = results.rowCount
        const chefId = results.rows[0].id

        let resultsFiles = await File.showFiles(chef.file_id)

        const files = resultsFiles.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))


        if (chef.id == null) {
            let totalRecipes = 0

            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
            const chefId = results.rows[0].id

            if (!chef) return res.send("Chef não encontrado!")

            return res.render("admin/chefs/edit", { chef, totalRecipes, chefId, files })

        } else {
            if (!chef) return res.send("Chef não encontrado!")

            return res.render("admin/chefs/edit", { chef, recipes, totalRecipes, chefId, files })
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