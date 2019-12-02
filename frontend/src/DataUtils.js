export const getChordsForUser = async (host, token) => {
  const url = `https://${host}/Alpha/Chords`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      //'Content-Type': 'application/json'
      'auth':token,
    },
  });
  return await res.json();
}