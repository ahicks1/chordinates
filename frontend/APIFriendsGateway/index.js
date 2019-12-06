const pg =  require('pg');

//connection details inherited from environment
const pool = new pg.Pool({
    max: 1,
    min: 0,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000
});

exports.handler = async (event, context) => {

  // https://github.com/brianc/node-postgres/issues/930#issuecomment-230362178
  context.callbackWaitsForEmptyEventLoop = false; // !important to reuse pool
  console.log('DB Connecting')
  const client = await pool.connect();
  console.log('DB Connected')

  
  //const client = await pool.connect();
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  try {
    const r = await client.query('SELECT * FROM public."Song"');
    console.log(r);
    response.body = JSON.stringify(r);
  } finally {
    // https://github.com/brianc/node-postgres/issues/1180#issuecomment-270589769
    client.release(true);
  }
  
  return response;
};