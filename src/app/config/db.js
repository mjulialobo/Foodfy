  const { Pool } = require("pg")

  module.exports = new Pool({
      user: 'postgres',
      password: "postlobo",
      host: "localhost",
      post: 5432,
      database: "foodfy"
  })