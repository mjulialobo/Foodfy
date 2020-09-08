const db = require('../../app/config/db')

const Base = require('./Base')

Base.init({
  table: 'chefs'
})

module.exports = {
  ...Base,
  async findAll() {
    try {
      const results = await db.query(`
      SELECT chefs.*, files.path as file
      FROM chefs
      LEFT JOIN files ON (chefs.file_id = files.id)
      ORDER BY updated_at DESC
      `)

      return results.rows
    } catch (err) {
      console.error(err)

    }
  },
  async findOne(id) {
    try {
      const results = await db.query(
        `
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
      `,
        [id])

      return results.rows[0]
    } catch (err) {
      console.error(err)
    }
  },
  async delete(id) {
    try {

      await db.query(`
    DELETE FROM chefs
    WHERE id = $1
    `, [id])

      const results = await db.query(`
    SELECT files.*
    FROM files
    LEFT JOIN chefs ON (files.id = chefs.file_id)
    WHERE chefs.id = $1
    `, [id])

      const files = results.rows

      files.map(async file => {
        fs.unlinkSync(`public/${file.path}`)
        await db.query(`
      DELETE FROM files
      WHERE id = $1
      `, [file.id])

      })
    } catch (err) {
      console.error(err)

    }
  },
  async files(id) {
    try {
      const results = await db.query(
        `
      SELECT files.*
      FROM files
      LEFT JOIN chefs ON (files.id = chefs.file_id)
      WHERE chefs.id = $1
      `, [id]
      )
      return results.rows
    } catch (err) {
      console.error(err)
    }
  },
}