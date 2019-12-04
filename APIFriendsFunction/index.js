const pg =  require('pg');

//connection details inherited from environment
const pool = new pg.Pool({
    max: 1,
    min: 0,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000
});

const getQueryText = `SELECT email, uids.uid
FROM (SELECT "uID1" as uid
FROM public.friends
WHERE "uID2" = $1
UNION 
SELECT "uID2" as uid
FROM public.friends
WHERE "uID1" = $1) AS uids, public."User"
WHERE uids.uid = public."User"."uid";`;

const checkFriendExistsQueryText = `SELECT EXISTS (SELECT email, uids.uid
FROM (SELECT "uID1" as uid
FROM public.friends
WHERE "uID2" = $1
UNION 
SELECT "uID2" as uid
FROM public.friends
WHERE "uID1" = $1) AS uids, public."User")
WHERE uids.uid = public."User"."uid";`;

const addNewFriendQueryText = `INSERT INTO public.friends("uID1", "uID2")
	SELECT public."User".uid as "uID1", $2 as "uID2"
		   FROM public."User"
		   WHERE email = $1;`;

const getFriendsForUser = async (client, userID) => {
  const query = {
    text:getQueryText,
    values: [userID],
  };
  const response = await client.query(query);
  return response.rows;
};

const getFriend = async (client, {uID1, uID2}) => {
  if(!uID1 || !uID2) throw new Error('No id provided');
  //Check if friend exists in databse
  const existResponse = await client.query({
    text: checkFriendExistsQueryText,
    values: [uID1, uID2],
  });

  console.log('Exist response');
  console.log(existResponse);
  
    if (!existResponse.rows.length > 0 && existResponse.rows[0].exists) {
      console.log('This friend does not exist')
    }
}

const addFriendForUser = async (client, 
   email, userID) => {
  const query = {
    text: addNewFriendQueryText,
    values: [email, userID],
  }
  const response = await client.query(query);
  return response;
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

  //TODO: Paginate!
  try {
    switch (event.httpMethod) {
      case 'GET':
        const rows = await getFriendsForUser(client, userID);
        return closeAndReturn(client, {
          statusCode: 200,
          headers: {'Access-Control-Allow-Origin':'*'},
          body: JSON.stringify({friends: rows})
        });
      case 'POST':
        if(!JSON.parse(event.body)) {
          return closeAndReturn(client, {
            statusCode: 400, 
            headers: {'Access-Control-Allow-Origin':'*'},
            body: 'Missing friend info',
          });
        }
        //const friendID = await getFriendsForUser(client,  userID);
        //console.log(friendID);
        const {email} = JSON.parse(event.body);
        if(!(email)) return closeAndReturn(client, {
            statusCode: 401, 
            body: 'Malformed Query',
          });
        await addFriendForUser(client, email, userID);
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