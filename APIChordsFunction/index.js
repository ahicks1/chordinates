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

const addSongQueryText = `INSERT INTO public."Song"(url, name, artist, genre)
VALUES ($1, $2, $3, $4);`

const getSongIdQueryText = `SELECT "sID"
FROM public."Song"
WHERE url = $1;`

const checkSongExistsQueryText = `SELECT EXISTS (
  SELECT url FROM public."Song" WHERE url = $1
)`;

const addNewChordQueryText = `INSERT INTO public."Chord"(longitude, latitude, 
  permission, "uID", "tID", "sID")
VALUES ($1, $2, $3, $4, $5, $6);`

const dummyUUID = '103c946d-ef98-42c1-b0be-cc815818c405';

const getChordsForUser = async (client, userID = dummyUUID) => {
  const query = {
    text:getQueryText,
    values: [userID],
  }
  const response = await client.query(query);
  return response.rows;
}

const getOrInsertSong = async (client, {artist, title, album, id}) => {
  if(!id) throw new Error('No id provided');
  //Check if song exists in databse
  const existResponse = await client.query({
    text: checkSongExistsQueryText,
    values: [`https://open.spotify.com/track/${id}`],
  });

  console.log('Exist response');
  console.log(existResponse);

  //Insert if not
  if (existResponse.rows.length > 0 && !existResponse.rows[0].exists) {
    console.log('No song, so adding');
    const addResponse = await client.query({
      text: addSongQueryText,
      values: [`https://open.spotify.com/track/${id}`, title, artist, album],
    })
    console.log('Add response');
    console.log(addResponse);
    
  }

  //Get song id
  const songIdResponse = await client.query({
    text: getSongIdQueryText,
    values: [`https://open.spotify.com/track/${id}`],
  })
  console.log('get songID response');
  console.log(songIdResponse);
  return songIdResponse.rows[0].sID;
  

}

const addChordForUser = async (
    client, 
    longitude, 
    latitude, 
    permission, 
    userId,
    timeId, 
    songId) => {
  const query = {
    text: addNewChordQueryText,
    values: [longitude, latitude, permission, userId, timeId, songId ],
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
      case 'POST':
        if(!event.songInfo || !event.songInfo.title) {
          return closeAndReturn(client, {
            statusCode: 400, 
            body: 'Missing song info',
          });
        }
        const songID = await getOrInsertSong(client, event.songInfo);
        console.log(songID);
        const {latitude, longitude, permission, tID} = JSON.parse(event.body);
        if(!(latitude && longitude && permission && tID)) return closeAndReturn(client, {
            statusCode: 401, 
            body: 'Malformed Query',
          });
        await addChordForUser(
          client,
          longitude,
          latitude,
          permission,
          userID,
          tID,
          songID);
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