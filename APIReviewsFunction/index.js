const pg =  require('pg');

//connection details inherited from environment
const pool = new pg.Pool({
    max: 1,
    min: 0,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000
});

const getQueryText = `SELECT AVG("numStars")
FROM public."Rating"
WHERE public."Rating"."pinID" = $1
`;

const addNewRatingQueryText = `INSERT INTO public."Rating"("numStars", "uID", "pinID")
  VALUES ($1, $2, $3)`;

const addRatingForUser = async(client, userID, pinID, numStars) =>{
  const query = {
    text: addNewRatingQueryText,
    values: [numStars, userID, pinID],
  };
  const response = await client.query(query);
  return response.rows;
};

const getRatingsForUser = async (client, pinID) => {
  const query = {
    text:getQueryText,
    values: [pinID],
  };
  const response = await client.query(query);
  return response.rows;
};




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

  const userID = event.requestContext.authorizer.claims.sub;
  const pinID = parseInt(event.pathParameters['chord-id'])

  //TODO: Paginate!
  try {
    switch (event.httpMethod) {
      case 'GET':
        const rows = await getRatingsForUser(client, pinID);
        return closeAndReturn(client, {
          statusCode: 200,
          headers: {'Access-Control-Allow-Origin':'*'},
          body: JSON.stringify({ratings: rows})
        });
      case 'POST':
        if(!JSON.parse(event.body)) {
          return closeAndReturn(client, {
            statusCode: 400, 
            headers: {'Access-Control-Allow-Origin':'*'},
            body: 'Missing rating info',
          });
        }
        const {pinID, numStars} = JSON.parse(event.body);
        if(!(pinID) ||  !(numStars)) return closeAndReturn(client, {
            statusCode: 401, 
            body: 'Malformed Query',
          });
        await addRatingForUser(client, userID, pinID, numStars);
        return closeAndReturn(client, {
          statusCode: 300,
          body: 'inserted',
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