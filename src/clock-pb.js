import React, { useState, useMemo } from 'react';
import { useInterval }   from './lib/util-ui';

const getDatetime = (date = new Date()) => {
  const TF = {  // Time Format
    en     : "en-US",   // en-US, ja-JP, ko-KR,
    numeric: "numeric",
    short  : "short",
  };
  return ({  // return an object
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
  })
};

export const ClockProgBar = () => {
  const [datetime, setDatetime] = useState(getDatetime());

  const dateFormat = (date, dow) => {
    console.log("dateFormat", date);
    return <span className="dtf" data-w={dow}>{date.replace(", ", ".")}</span>;
  }

  const progressHours = nH => {
    const PB = '■'; // ASCII 254 ■ x 24
    console.log("progressHours", nH);
    return <div className="pgb">
        <span className="on">{PB.repeat(nH)}</span>{PB.repeat(24-nH)}
      </div>;
  }

  // Optimization: Memoize
  const dateFormatMemo    = useMemo(() =>
    dateFormat(datetime.dt, datetime.dow), [datetime.dt, datetime.dow]);  // update dayly
  const progressHoursMemo = useMemo(() =>
    progressHours(datetime.hrs), [datetime.hrs]);

  return (
    <>
      <TimeTick hourly={datetime => setDatetime(datetime)} /><br/>
      {dateFormatMemo}<br/>
      {progressHoursMemo}
    </>
  );
}

const TimeTick = props => {
  const { hourly } = props;              // hourly callback
  const rLastHour = React.useRef(null);  // last tick

  const [datetime, setDatetime] = useState(getDatetime());  // initial setting

  const hourlyFire = () => {
    hourly?.(datetime);
    rLastHour.current = datetime.hrs;
  }

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
