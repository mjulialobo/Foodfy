const recipes = require('../../lib/scripts/data')


exports.home = function(req, res) {
    return res.render('general/index')
}


exports.about = function(req, res) {
    console.log("batatinha")
    return res.render('general/about')
}


exports.recipes = function(req, res) {

    return res.render('general/recipes')
}


exports.details = function(req, res) {
    const id = req.params.id
    const recipe = recipes.find(function(recipe) {

        if (recipe.id == id) {
            return true
        }
    })
    if (!recipe) {
        return res.send("Recipe not found!")
    }
    return res.render("general/recipe", { item: recipe });

}