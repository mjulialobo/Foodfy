const Recipe = require('../../models/recipe')
const Chef = require('../../models/chef')


module.exports = {
    async home(req, res) {
        try {
            const recipes = await Recipe.all()

            if (!recipes) return res.send("Recipe not found")

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

            return res.render("general/index", { recipes: eachRecipe })
        } catch (err) {
            console.log(err)
        }
    },

    about(req, res) {

        return res.render('general/about')
    },


    async recipes(req, res) {
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

            return res.render('general/recipes', { recipes: eachRecipe, filter, pagination })

        } catch (err) {
            console.log(err)
        }
    },
    async details(req, res) {
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

            return res.render('general/recipe', { recipe, chef, files: results })

        } catch (err) {
            console.log(err)
        }
    },


    async chefs(req, res) {
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

            return res.render('general/chefs', { chefs: chefImage, filter, pagination })
        } catch (err) {
            console.log(err)
        }
    },
    async chef(req, res) {
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

            return res.render('general/chef', { chef, recipes, chefAvatar })
        } catch (err) {
            console.log(err)
        }

    }

}