var aws = require('aws-sdk');
const fetch = require('node-fetch');
var lambda = new aws.Lambda({
  region: 'us-east-2' //change to your region
});

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_AUTH_B64 = process.env.SPOTIFY_AUTH_B64;
/***
 * 
 * This function calls the spotify API to get song information for the given url
 * 
 * */
let accessToken;
const getAccessToken = async () => {
  if(accessToken) return accessToken;
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${SPOTIFY_AUTH_B64}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const json = await response.json();
  console.log(json);
  accessToken = json.access_token;
  return accessToken;
}

const getSongInformation = async (songID) => {
  const token = await getAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/tracks/${songID}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  const body = await response.json();
  return {
    artist: body.artists[0].name,
    title: body.name,
    album: body.album.name,
    id: songID,
  }
}
/**
 * 
 * @param {String} lambdaName 
 * @param {String} payload 
 */
const invokeLambdaPromise = (lambdaName, payload) => {
  return new Promise((resolve, reject) => {
    lambda.invoke({
      FunctionName: lambdaName,
      Payload: payload // pass params
    }, function(error, data) {
      if (error) {
        reject(error);
      }
      if(data.Payload){
       resolve(data.Payload);
      }
    });
  })
}

const badRequest = () => {
  const response = {
    statusCode: 400,
    body: JSON.stringify('Malformed request'),
  };
  return response;
}


exports.handler = async (event) => {
  const idMatch = JSON.parse(event.body).url.match(/track\/([\w]+)/);
  if (idMatch == null) return badRequest();
  const songID = idMatch[1];
  const songInfo = await getSongInformation(songID)
  console.log(songInfo);
  const lambdaPayload = JSON.stringify({...event, songInfo: songInfo});
  const lambdaResponse = await invokeLambdaPromise('APIChordsFunction', lambdaPayload);
  return JSON.parse(lambdaResponse);
};
