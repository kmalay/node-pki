const { Pool } = require('pg')

const pool = new Pool({database: 'bridge'})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
