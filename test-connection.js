const { getConnection } = require('./src/db');

async function main() {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT SYS_CONTEXT('USERENV', 'DB_NAME') AS db_name,
              SYS_CONTEXT('USERENV', 'CON_NAME') AS container,
              SYS_CONTEXT('USERENV', 'SERVER_HOST') AS host,
              TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS now
       FROM dual`
    );
    console.log('Connected successfully!');
    console.log(result.rows);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error('Close error:', e);
      }
    }
  }
}

main();
