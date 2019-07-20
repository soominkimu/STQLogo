import React, { useState, useEffect, useMemo } from 'react';
import { useInterval }   from './lib/util-ui';

export const ClockProgBar = () => {
  const [datetime, setDatetime] = useState({dt:"", dow:1, hrs:0});

  const dateFormat = (date, dow) => {
    let dtS = date.slice(0,3);
    dtS    += date.slice(4,14);
    console.log("dateFormat", dtS);
    return <span className="dtf" data-w={dow}>{dtS}</span>;
  }

  const progressHours = nH => {
    const PB = '■■■■■■■■■■■■■■■■■■■■■■■■'; // ASCII 254 ■ x 24
    console.log("progressHours", nH);
    return <div className="pgb">
        <span className="on">{PB.slice(0, nH)}</span>{PB.slice(0, 24-nH)}
      </div>;
  }

  const handleHourly = datetime => {
    setDatetime(datetime);
  }

  // Optimization: Memoize
  const dateFormatMemo    = useMemo(() =>
    dateFormat(datetime.dt, datetime.dow), [datetime.dt, datetime.dow]);  // update dayly
  const progressHoursMemo = useMemo(() =>
    progressHours(datetime.hrs), [datetime.hrs]);

  return (
    <>
      <TimeTick
        hourly={handleHourly}
      /><br/>
      {dateFormatMemo}<br/>
      {progressHoursMemo}/>
    </>
  );
}

const TimeTick = props => {
  const { hourly } = props;
  const rLastHour = React.useRef(null);  // last tick

  const TF = {  // Time Format
    en     : "en-US",   // en-US, ja-JP, ko-KR, 
    numeric: "numeric",
    short  : "short",
  };
  const getDatetime = (date = new Date()) => ({  // return an object
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

  const hourlyFire = () => {
    hourly && hourly(datetime);
    rLastHour.current = datetime.hrs;
  }

  useEffect(() => {  // initial fire
    setDatetime(getDatetime());
    hourlyFire();
    console.log("useEffect for initial fire")
// eslint-disable-next-line
  }, []);

  useInterval(() => {
    setDatetime(getDatetime());
    if (rLastHour.current !== datetime.hrs) {  // initially lastH is null, so it works
      hourlyFire();
    }
  }, 1000);

  return (
    <span className="tmf">{datetime.tm}</span>
  );
}

/*
  const dateFormatMemo    = useMemo(() => dateFormat(datetime.dt, datetime.dow), [datetime.dt, datetime.dow]);
*/
