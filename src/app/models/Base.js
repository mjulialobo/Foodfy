const db = require('../config/db')

function find(filters, table) {
  let query = `SELECT * FROM ${table}`


  if (filters) {
    Object.keys(filters).map(key => {
      // WHERE | OR | AND
      query += ` ${key}`

      Object.keys(filters[key]).map(field => {
        query += ` ${field} = '${filters[key][field]}'`
      })
    })
  }

  return db.query(query)
}

const Base = {
  init({
    table
  }) {

    if (!table) throw new Error('Invalid params.')

    this.table = table

    return this
  },
  async create(fields) {
    try {

      let keys = [],
        values = []

      Object.keys(fields).map((key) => {
        keys.push(key)
        values.push(`'${fields[key]}'`)
      })

      const query = `
        INSERT INTO ${this.table} (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id
      `

      const results = await db.query(query)

      return results.rows[0].id
    } catch (err) {
      console.error(err)
    }
  },
  async update(id, fields) {
    try {

      let update = []


      Object.keys(fields).map(key => {

        const line = `${key} = '${fields[key]}'`
        update.push(line)

      })

      let query = `UPDATE ${this.table} SET
      ${update.join(',')} WHERE id = ${id}
      `
      return db.query(query)

    } catch (err) {
      console.error(err)
    }
  },
  async findOne(filters) {
    try {
      const results = await find(filters, this.table)

      return results.rows[0]
    } catch (err) {
      console.error(err)
    }
  },
  async findAll(filters) {
    try {
      const results = await find(filters, this.table)

      return results.rows
    } catch (err) {
      console.error(err)
    }
  },
  async findChefRecipes(chefId) {
    try {
      const results = await db.query(`
    SELECT recipes.*, chefs.name AS author
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE chefs.id=$1
    ORDER BY created_at DESC
    `, [chefId])

      return results.rows
    } catch (err) {
      console.error(err)
    }
  },
}

module.exports = Base