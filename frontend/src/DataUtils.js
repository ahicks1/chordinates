export const getChordsForUser = async (host, token) => {
  const url = `https://${host}/Alpha/chords`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
  });
  return await res.json();
}

export const postChord = async (host, token, lat, long, view, time, spotifyurl) => {
  const url = `https://${host}/Alpha/chords`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
    body: JSON.stringify({
      latitude: lat, 
      longitude: long, 
      permission: view, 
      tID: time, 
      url: spotifyurl
    }),
  });
  return await res.json();
}

export const getFriends = async (host, token) => {
  const url = `https://${host}/Alpha/friends`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
  });
  return await res.json();
}

export const postFriend = async (host, token, email) => {
  const url = `https://${host}/Alpha/friends`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
    body: JSON.stringify({
      email: email
    }),
  });
  return await res;
}

export const getChordsNearLocation = async (host, token, lat, lon) => {
  const url = `https://${host}/Alpha/chords/near-location?lat=${lat}&lon=${lon}&range=${1000}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
  });
  return await res.json();
}
