const Recipe = require('../../models/recipe')
const Chef = require('../../models/chef')


module.exports = {
    home(req, res) {
        return res.render("general/index")
    },


    about(req, res) {

        return res.render('general/about')
    },


    recipes(req, res) {
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
                return res.render('general/recipes', { recipes, pagination, filter })
            }
        }
        Recipe.paginate(params)
    },
    async details(req, res) {
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

            return res.render('general/recipe', { recipe, chef, files })

        } catch (err) {
            console.log(err)
        }
    },


    chefs(req, res) {
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
                return res.render("general/chefs", { chefs, pagination, filter })
            }
        }
        Chef.paginate(params)
    },
    chef(req, res) {
        Chef.showChef(req.params.id, function(chef, recipes, totalRecipes) {
            if (chef.id == null) {
                totalRecipes = 0

                Chef.find(req.params.id, function(chef) {

                    if (!chef) return res.send("Chef not found")


                    return res.render("general/chef", { chef, totalRecipes })
                })
            } else {
                if (!chef) return res.send("Chef not found")
                return res.render("general/chef", { chef, recipes, totalRecipes })
            }

        })

    },

}