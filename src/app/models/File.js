const db = require('../config/db')
const fs = require('fs')

const Base = require('./Base')

Base.init({
  table: 'files'
})

module.exports = {
  ...Base,
  async delete(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file = result.rows[0]

      fs.unlinkSync(`public${file.path}`)

      await db.query(`
                DELETE FROM recipe_files WHERE file_id = $1
            `, [id])
      await db.query(`
                DELETE FROM files WHERE id = $1
            `, [id])

    } catch (err) {
      console.error(err)
    }
  }
}