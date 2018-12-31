const db = require('../db');

module.exports = async function() {
  console.log('Running global teardown...');

  await db.query(`delete from users where cn like 'client%'`);
  await db.query(`delete from signup where cn like 'client%'`);
}
