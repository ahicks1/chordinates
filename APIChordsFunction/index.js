const pg =  require('pg');

//connection details inherited from environment
const pool = new pg.Pool({
    max: 1,
    min: 0,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000
});

const getQueryText = `SELECT "pinID", "whenMade", "longitude", "latitude", 
"permission", c."sID", c."tID", t."name" as timename, "start", "end", "url", 
s."name" as songname, "artist", "genre" 
FROM public."Chord" as c, public."Time" as t, public."Song" as s 
WHERE t."tID" = c."tID" AND s."sID" = c."sID" AND "uID" = $1;`;

const dummyUUID = '103c946d-ef98-42c1-b0be-cc815818c405';

const getChordsForUser = async (client, userID = dummyUUID) => {
  const query = {
    text:getQueryText,
    values: [userID],
  }
  const response = await client.query(query);
  return response.rows;
}

const addChordForUser = async (client, longitude, latitude, permission, timeId, songURL) => {
  const query = {
    text:getQueryText,
    values: [userID],
  }
  const response = await client.query(query);
  return response.rows;
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

  console.log(event);
  console.log(context);

  const userID = event.requestContext.identity.cognitoIdentityId;

  //TODO: Paginate!
  try {
    switch (event.httpMethod) {
      case 'GET':
        const rows = await getChordsForUser(client, userID);
        return closeAndReturn(client, {
          statusCode: 200,
          body: JSON.stringify({chords: rows})
        });
      // case 'POST':
      //   break;
      default:
          return closeAndReturn(client, {
            statusCode: 405,
            body: `${event.resource} doesn't support method ${event.httpMethod}`
          });
    }
  } finally {
    client.release(true);
  }
  

  
  // //const client = await pool.connect();
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify('Hello from Lambda!'),
  // };
  // try {
  //   const r = await client.query('SELECT * FROM public."Song"');
  //   console.log(r);
  //   response.body = JSON.stringify(r);
  // } finally {
  //   // https://github.com/brianc/node-postgres/issues/1180#issuecomment-270589769
  //   client.release(true);
  // }
  
  // return response;
};