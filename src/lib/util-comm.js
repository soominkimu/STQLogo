//import React from 'react';

export const fetchJSON = async (url, callback) => {
  const res = await fetch(url);
  const cT = await res.headers.get('content-type');
  console.log("content type:", cT);
  let json  = null;
  let error = null;
  if (cT && cT.includes('application/json')) {
    json = await res.json();
  } else {
    error = "Error: No JSON file!";
  }
  callback(json, error);
}

/*
  fetch(url)
    .then(res => {
      const cT = res.headers.get('content-type');
      console.log("content type:", cT);
      if (cT && cT.includes('application/json'))
        return res.json();
      throw new TypeError("Error: No JSON file!");
    })
    .then(data   => callback(data, null))
    .catch(error => callback(null, error));
*/
