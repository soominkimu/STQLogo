import React             from 'react';
import { fetchJSON }     from './util-comm'
import { isSafari }      from './util-ui';

export const DATA = {
  count    : 0,
  anidef   : null,
  articles : null
};

export const useFetchData = (readyCB, deps=[]) => {
  const urls = [
    "./data/anidef.json",
    "./data/articles.json",
  ];

  const handleFetch = (data, error) => {
    if (error) {
      readyCB(error);
      return;
    }
    DATA[data.id] = data;
    if (isSafari && (data.id === "anidef")) {
      DATA[data.id].factor = data.factorSafari;
    }
    delete DATA[data.id].factorSafari;  // release
    console.log(data.id, DATA[data.id]);
    if (++DATA.count >= urls.length)
      readyCB(null);
  }

  React.useEffect(() => {
    urls.forEach( url => fetchJSON(url, handleFetch) );
// eslint-disable-next-line
  }, deps);
}

