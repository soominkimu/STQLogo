import React             from 'react';
import { fetchJSON }     from './lib/util-comm'
import { isSafari }      from './lib/util-ui';

export const DATA = { count: 0 };

export const useFetchData = (readyCB, deps=[]) => {
  const urls = [
    "./data/anidef.json",    // ../public/data/anidef.json
    "./data/articles.json",  // ../public/data/articles.json
  ];

  const handleFetch = (data, error) => {
    if (error) {
      readyCB(error);
      return;
    }
    DATA[data.id] = data;  // id is the property defined in JSON file ("anidef", "articles")
    if (isSafari && (data.id === "anidef")) {  // replace with Safari specific data
      DATA[data.id].factor = data.factorSafari;
    }
    delete DATA[data.id].factorSafari;  // release
    //console.log(data.id, DATA[data.id]);
    if (++DATA.count >= urls.length)    // loaded all data files
      readyCB(null);
  }

  React.useEffect(() => {
    urls.forEach( url => fetchJSON(url, handleFetch) );
// eslint-disable-next-line
  }, deps);  // load data only once
}

