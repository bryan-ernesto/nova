const { Pool } = require('pg');

const getConnNova = new Pool({
  host: '192.168.2.82',
  user: 'vince',
  password: 'bG4127#uxgNmz',
  database: 'nova',
  port: '5432',
});

const getConnGroupNova = new Pool({
  host: '192.168.2.82',
  user: 'vince',
  password: 'bG4127#uxgNmz',
  database: 'groupnova',
  port: '5432',
});

module.exports = {
  getConnNova, getConnGroupNova,
};
