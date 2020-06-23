const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const recipes = require('./public/scripts/data')

server.set("view engine", "njk")

server.use(express.static("public"))

nunjucks.configure("views", {
    express: server
})


server.get("/", function(req, res) {
    return res.render("index")

})

server.get("/about", function(req, res) {
    return res.render("about")

})

server.get("/recipes", function(req, res) {
    return res.render("recipes")

})

server.get("/recipe/:id", function(req, res) {
    const id = req.params.id
    const recipe = recipes.find(function(recipe) {

        if (recipe.id == id) {
            return true
        }
    })
    if (!recipe) {
        return res.send("Recipe not found!")
    }
    return res.render("recipe", { item: recipe });
})

server.listen(4000, function() {
    console.log("server is running")
})