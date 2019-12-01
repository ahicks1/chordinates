const pg =  require('pg');

//connection details inherited from environment
const pool = new pg.Pool({
    max: 1,
    min: 0,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000
});

const getQueryText = `SELECT *
FROM public."fullchord"
WHERE latitude < $1::float + $3::float AND latitude > $1::float - $3::float
AND longitude < $2::float + $3::float AND longitude > $2::float - $3::float;`;

const getChordsByLocation = async (client, {lat, lon}, range, type) => {
  const query = {
    text:getQueryText,
    values: [lat, lon, range],
  }
  const response = await client.query(query);
  return response.rows;
}

exports.handler = async (event, context) => {

  // https://github.com/brianc/node-postgres/issues/930#issuecomment-230362178
  context.callbackWaitsForEmptyEventLoop = false; // !important to reuse pool
  console.log('DB Connecting');
  const client = await pool.connect();
  console.log('DB Connected');

  console.log(event);
  console.log(context);

try {
  switch (event.httpMethod) {
    case 'GET':
      const {lat, lon, range=4} = event.queryStringParameters;
      const rows = await getChordsByLocation(client, {lat:parseFloat(lat), lon:parseFloat(lon)}, parseFloat(range));
      return {
        statusCode: 200,
        body: JSON.stringify({chords: rows})
      };
    default:
        return {
          statusCode: 405,
          body: `${event.resource} doesn't support method ${event.httpMethod}`
        };
  }
} finally {
  client.release(true);
}
};