const pg =  require('pg');
//Morgan was here
//connection details inherited from environment
const pool = new pg.Pool({
    max: 1,
    min: 0,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000
});

const deleteQueryText = `DELETE FROM public."Chord"
WHERE "pinID" = $1 AND "uID" = $2;`

const updateQueryText = `UPDATE public."Chord"
SET permission=$5, "tID"=$6
WHERE "pinID" = $1 AND "uID" = $2;`

exports.handler = async (event, context) => {

  console.log(event);
  console.log(context);

  // https://github.com/brianc/node-postgres/issues/930#issuecomment-230362178
  context.callbackWaitsForEmptyEventLoop = false; // !important to reuse pool
  console.log('DB Connecting')
  const client = await pool.connect();
  console.log('DB Connected')


  console.log(event);
  console.log(context);

  const pinID = event.pathParameters['chord-id'];
  const userID = event.requestContext.authorizer.claims.sub;
  const closeAndReturn = (client, response) => {
    //client.release(true);
    return response;
  }
  //TODO: Paginate!
  try {
    switch (event.httpMethod) {
      case 'POST':
        const {permission, tID} = JSON.parse(event.body);
        await client.query({
          text: updateQueryText,
          values: [pinID, userID, permission, tID]
        });
        return closeAndReturn(client, {
          statusCode: 200,
          body: 'updated'
        });
      case 'DELETE':
        const response = await client.query({
          text: deleteQueryText,
          values: [pinID,userID]
        })
        return closeAndReturn(client, {
          statusCode: 300,
          body: 'deleted',
        });
      default:
          return closeAndReturn(client, {
            statusCode: 405,
            body: `${event.resource} doesn't support method ${event.httpMethod}`
          });
    }
  } finally {
    client.release(true);
  } 
};