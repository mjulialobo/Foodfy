const Recipe = require('../models/Recipe')

  async function createRecipesList() {
   try {
    let recipes = await Recipe.findAll()
  
    async function getImage(productId) {
      let results = await Recipe.files(productId)
  
      return results[0]
    }
  
    const recipesPromise = recipes.map(async recipe => {
  
      recipe.file = await getImage(recipe.id)
  
      return recipe
    })
  
    let recipesList = await Promise.all(recipesPromise)
  
    return recipesList
   } catch (err) {
     console.error(err)
   }
  }


module.exports = {
  createRecipesList
}
