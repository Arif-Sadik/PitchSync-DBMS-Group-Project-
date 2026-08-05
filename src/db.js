const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: process.env.DB_USER || 'pitchsync',
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING || 'localhost:1522/pdb12c',
};

async function getConnection() {
  return oracledb.getConnection(dbConfig);
}

module.exports = { getConnection, dbConfig };
