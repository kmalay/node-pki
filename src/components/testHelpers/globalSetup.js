const db = require('../db');

module.exports = async () => {
  console.log('');
  console.log('Running global setup...');

  const sqlInsertUser = `
    insert
      into users(cn, first_name, last_name, email, phone_number)
    values ('client1', 'Client', '1', 'client1@example.com', '555-555-5555');
  `;

  const sqlInsertSignup = `
    insert
      into signup(cn, first_name, last_name, email, phone_number)
    values ('client1', 'Client', '1', 'client1@example.com', '555-555-5555');
  `;

  try {
    await db.query(`delete from users where cn like 'client%' `);
  } catch(error) {
    console.error(error)
  }

  try {
    await db.query(`delete from signup where cn like 'client%' `)
  } catch(error) {
    console.error(error)
  }

  try {
    await db.query(sqlInsertUser);
    await db.query(sqlInsertSignup);
  } catch(error) {
    console.error(error);
  }
};
