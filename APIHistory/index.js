const pg =  require('pg');

//connection details inherited from environment
const pool = new pg.Pool({
    max: 1,
    min: 0,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000
});

const addHistoryText = `INSERT INTO public."Play"("uID", "pinID")
VALUES ($1, $2);`;

const getHistoryText = `SELECT * 
FROM public."Play", public.fullchord
WHERE public."Play"."uID" = $1
AND public."Play"."pinID" = public.fullchord."pinID";`;

const getHistoryForUser = async (client, userID) => {
  const query = {
    text: getHistoryText,
    values: [userID],
  }
  const response = await client.query(query);
  return response.rows;
}

const addHistoryForUser = async (client, userID, pinID) => {
  const query = {
    text: addHistoryText,
    values: [userID, pinID],
  }
  const response = await client.query(query);
  return response;
}

const closeAndReturn = (client, response) => {
  //client.release(true);
  return response;
}

exports.handler = async (event, context) => {

  // https://github.com/brianc/node-postgres/issues/930#issuecomment-230362178
  context.callbackWaitsForEmptyEventLoop = false; // !important to reuse pool
  console.log('DB Connecting')
  const client = await pool.connect();
  console.log('DB Connected')

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify('Hello from Lambda!'),
  // };
  const userID = event.requestContext.authorizer.claims.sub;
  try {
    switch (event.httpMethod) {
      case 'GET':
          const rows = await getHistoryForUser(client, userID);
          return closeAndReturn(client, {
            statusCode: 200,
            headers: {'Access-Control-Allow-Origin':'*'},
            body: JSON.stringify({history: rows})
          });
      case 'POST':
        const {pinID} = JSON.parse(event.body);
          if(!pinID) {
            return closeAndReturn(client, {
              statusCode: 400, 
              headers: {'Access-Control-Allow-Origin':'*'},
              body: 'Missing history info',
            });
          }
          await addHistoryForUser(client, userID, pinID);
          return closeAndReturn(client, {
            statusCode: 300,
            headers: {'Access-Control-Allow-Origin':'*'},
            body: 'inserted',
          });
      default:
          return closeAndReturn(client, {
            statusCode: 405,
            headers: {'Access-Control-Allow-Origin':'*'},
            body: `${event.resource} doesn't support method ${event.httpMethod}`
          });
    }
  } finally {
    client.release(true);
  }
  
  return response;
};