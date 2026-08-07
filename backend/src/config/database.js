const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

function requireEnv(name, fallback) {
  const value = process.env[name] || fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function buildConnectString() {
  const host = requireEnv('DB_HOST', '127.0.0.1');
  const port = requireEnv('DB_PORT', '1523');
  const service = requireEnv('DB_SERVICE', 'ORCLPDB1');

  return `${host}:${port}/${service}`;
}

function getDbConfig() {
  return {
    user: requireEnv('DB_USER', 'LTMS_APP'),
    password: requireEnv('DB_PASSWORD'),
    connectString: buildConnectString(),
  };
}

async function getConnection() {
  return oracledb.getConnection(getDbConfig());
}

module.exports = {
  buildConnectString,
  getConnection,
  getDbConfig,
};
