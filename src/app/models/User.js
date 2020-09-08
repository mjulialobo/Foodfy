const db = require('../config/db')
const fs = require('fs')

const Base = require('./Base')

Base.init({
  table: 'users'
})

module.exports = {
  ...Base,
  async put(id, user) {
    const query =
      `
      UPDATE users SET
      name=($1),
      email=($2),
      is_admin=($3)
      WHERE id =($4)
      `
      const values = [
        user.name,
        user.email,
        user.is_admin,
        id
      ]      

    db.query(query, values)
  },
  async delete(id) {
    try {

      const recipesResults = await db.query(
        `
      SELECT recipes.*, recipe_id, file_id
      FROM recipes
      LEFT JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
      WHERE recipes.user_id = $1
      `, [id]
      )
      const recipes = recipesResults.rows

      let files = await Promise.all(recipes.map(async recipe => {

        const results = await db.query(
          `
        SELECT *
        FROM files
        WHERE files.id = $1
        `, [recipe.file_id])

        return results.rows[0]
      }))

      files.map(async file => {
        fs.unlinkSync(`public/${file.path}`)
      })

      await db.query(`
      DELETE FROM users
      WHERE id = $1
     `, [id])

      return
    } catch (err) {
      console.error(err)
    }
  }
}