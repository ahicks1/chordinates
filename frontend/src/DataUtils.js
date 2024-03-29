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

export const updateChord = async (host, token, pinID, view, time) => {
  const url = `https://${host}/Alpha/${pinID}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
    body: JSON.stringify({
      permission: view, 
      tID: time,
    }),
  });
  return res.json();
}

export const deleteChord = async (host, token, pinID) => {
  const url = `https://${host}/Alpha/${pinID}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
  });
  return res;
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
  return res;
}

export const deleteFriend = async (host, token, uID) => {
  const url = `https://${host}/Alpha/friends`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
    body: JSON.stringify({
      uID: uID
    }),
  });
  return res;
}

export const getHistoryForUser = async (host, token) => {
  const url = `https://${host}/Alpha/history`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
  });
  return await res.json();
}

export const playSong = async (host, token, pinID) => {
  const url = `https://${host}/Alpha/history`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
    body: JSON.stringify({
      pinID: pinID,
    }),
  });
  return await res.json();
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

export const getReviews = async (host, token, pinID) => {
  const url = `https://${host}/Alpha/${pinID}/reviews`;
  const res = await fetch(url, {
    method:  'GET',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
  });
  return await res.json();
}

export const postReviews = async (host, token, pinID, numStars) => {
  const url = `https://${host}/Alpha/${pinID}/reviews`;
  const res = await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      auth:token,
    },
    body: JSON.stringify({
      numStars: numStars,
    }),
  });
  return await res.json();
}