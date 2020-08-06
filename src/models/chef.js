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
    async showChef(id) {
        try {
            const results = await db.query(`
            SELECT *
            FROM chefs 
            LEFT JOIN recipes
            ON (recipes.chef_id = chefs.id) 
            WHERE chefs.id = $1
            `, [id])

            return results.rows
        } catch (err) {
            console.log(err)
        }

    },
    async find(id) {
        try {
            const results = await db.query(`SELECT chefs.*, 
            count(recipes) AS total_recipes
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            `, [id])

            return results.rows[0]
        } catch (err) {
            console.log(err)
        }

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

    async paginate(params) {
        let { filter, limit, offset } = params

        let query = '',
            filterQuery = '',
            totalQuery = `(
                SELECT count(*)
                FROM chefs 
            ) AS total`

        if (filter) {
            filterQuery = `
                WHERE chefs.name ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*)
                FROM chefs 
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT chefs.*,
        ${totalQuery}
        FROM chefs 
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `

        const results = await db.query(query, [limit, offset])

        return results.rows
    },
    async findFile(id) {
        try {
            const results = await db.query(`
        SELECT files.*
        FROM files 
        LEFT JOIN chefs ON 
        (chefs.file_id = files.id)
        WHERE chefs.id = $1
        `, [id])

            return results.rows[0]
        } catch (err) {
            console.log(err)
        }
    },
    async files(id) {
        try {
            const results = await db.query(`SELECT files.path FROM files WHERE files.id = $1 `, [id])
            return results.rows

        } catch (err) {
            console.log(err);
        }
    }

}