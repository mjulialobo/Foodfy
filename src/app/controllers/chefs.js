const { date } = require("../../lib/utils.js")
const Chef = require('../../models/chef')

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 9
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
                return res.render("admin/chefs/chefs", { chefs, pagination, filter })
            }
        }
        Chef.paginate(params)
    },
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    post(req, res) {
        const keys = Object.keys(req.body)
            //validation
        for (key of keys) {
            //same as using req.body.avatar_url
            if (req.body[key] == "") {
                return res.send('Please, fill all fields.')

            }

        }
        Chef.create(req.body, function(chef) {
            return res.redirect(`admin/chef/${chef.id}`)
        })

    },
    show(req, res) {
        Chef.find(req.params.id, function(chef) {
            if (!chef) return res.send("Chef not found")
            return res.render("admin/chefs/show", { chef })

        })

    },
    edit(req, res) {
        Chef.find(req.params.id, function(chef) {
            if (!chef) return res.send("Chef not found")

            return res.render("admin/chefs/edit", { chef })

        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)
            //validation
        for (key of keys) {
            //same as using req.body.avatar_url
            if (req.body[key] == "") {
                return res.send('Please, fill all fields.')

            }

        }
        Chef.update(req.body, function() {
            return res.redirect(`admin/chefs/${req.body.id}`)
        })
    },
    delete(req, res) {
        Chef.delete(req.body.id, function() {
            return res.redirect(`admin/chefs`)
        })
    },

}