import React, { useState } from 'react';
import { useInterval }  from './util-ui';

export const ClockProgBar = () => {
  const TF = {
    en     : "en-US",   // en-US, ja-JP, ko-KR, 
    numeric: "numeric",
    short  : "short",
  };
  const getDatetime = (date = new Date()) => ({
    tm: date.toLocaleTimeString(TF.en,
      {
        hour12: false,
        hour  : TF.numeric,
        minute: TF.numeric,
        second: TF.numeric,
        //timeZoneName: TF.short,
        //timeZone: 'America/Los_Angeles'
      }),
    dt: date.toLocaleDateString(TF.en,
      {
        weekday: TF.short,
        day    : TF.numeric,
        month  : TF.numeric,
        year   : TF.numeric, 
        //timeZone: 'America/Los_Angeles'
      }),
    dow: date.getDay(),   // Sun - Sat: 0 - 6
    hrs: date.getHours()  // 0..23
  });

  const [datetime, setDatetime] = useState(getDatetime());  // initial setting

  useInterval(() => {
    setDatetime(getDatetime());
  }, 1000);

  const dateFormat = () => {
    let dtS = datetime.dt.slice(0,3);
    dtS += datetime.dt.slice(4,14);
    return <span className="dtf" data-w={datetime.dow}>{dtS}</span>;
  }

  // Making this user-defined component <ProgressHours nH={} /> causes re-render every second
  const progressHours = nH => {
    const pgb = n => {
      const PB = '■■■■■■■■■■■■■■■■■■■■■■■■';  // ASCII 254 ■ x 24
      return PB.slice(0, n);
    }
    return <div className="pgb"><span className="on">{pgb(nH)}</span>{pgb(24-nH)}</div>
  }

  return (
    <>
      <span className="tmf">{datetime.tm}</span><br/>
      {dateFormat()}<br/>
      {progressHours(datetime.hrs)}
    </>
  );
}
