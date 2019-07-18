//import React from 'react';

export const fetchJSON = (url, callback) => {
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
}
