const db = require('../app/config/db')
const { date } = require("../lib/utils")

module.exports = {
    all(callback) {
        db.query(`SELECT * FROM chefs
        `, function(err, results) {
            if (err) throw `Database Error! ${err}`
            callback(results.rows)
        })
    },
    create(data, file_id) {
        const query = `
        INSERT INTO chefs(
            name,
            file_id,
            created_at
        ) VALUES($1, $2, $3)
        RETURNING id
        `
        const values = [
            data.name,
            file_id,
            date(Date.now()).iso

        ]
        return db.query(query, values)

    },
    showChef(id) {
        return db.query(` SELECT * FROM chefs
        LEFT JOIN recipes 
        ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
      `, [id])
    },
    find(id) {
        return db.query('SELECT * FROM chefs WHERE id=$1', [id])
    },
    findBy(id) {
        return db.query(`
                    SELECT chefs.*, count(recipes) AS total_recipes FROM chefs 
                    LEFT JOIN recipes ON(chefs.id = recipes.chef_id) WHERE chefs.id=$1
                    GROUP BY chefs.id ORDER BY total_recipes DESC `, [id])
    },
    update(data) {

        const query = `
            UPDATE chefs SET 
            name = ($1), 
            WHERE id = $2 `
        const values = [
            data.name,
            data.id
        ]
        return db.query(query, values)

    },
    delete(id) {
        return db.query('DELETE FROM chefs WHERE id=$1', [id])
    },
    files(id) {
        return db.query(`
        SELECT * FROM files WHERE file_id= $1
        `, [id])
    },

    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                    SELECT count(*) FROM chefs
                    ) AS total`


        if (filter) {

            filterQuery = `
                WHERE chefs.name ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count (*) FROM chefs
                ${filterQuery}
                )as total
            `
        }

        query = `
            SELECT chefs.*,${totalQuery},count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            ${filterQuery}
            GROUP BY chefs.id 
            LIMIT $1 OFFSET $2 
        `

        db.query(query, [limit, offset], function(err, results) {
            if (err) throw `Database Error! ${err}`
            callback(results.rows)
        })
    }

}