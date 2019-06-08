import React, { useState } from 'react';
import { copyright, useWindowSize, useInterval } from './util-ui';
import { StarryNight } from './effects';
import { floor } from './util-math';
import './App.scss';

copyright("Logo v0,1");

// Safari does not show correctly overlapped circles.
// 0: Chrome, 1: Safari, 2: Firefox
const isSafari = (function() {
  console.log("detectBrowser()");
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1)
    return (ua.indexOf('chrome') > -1) ? 0 : 1;
  if (ua.indexOf('firefox'))
    return 2;
  return -1;
})() === 1; // IIFE

const NeonColors = ({ani, colors, ra, dr=12, t=0}) => {
  const NeonCircle = props =>
    <div className={ani}
      style={{
        '--ra': props.ra + 'px',
        '--cl': props.color,
        '--t' : props.t + 's',
        '--bm': isSafari ? 'screen' : undefined  // 'normal'
      }}
    >
      {props.children}
    </div>;
  return (
    <>{colors.map((c, i) => <NeonCircle key={i} ra={ra + dr*i} color={c} t={t + i} />)}</>
  );
}

const Datetime = () => {
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
        //timeZone: 'America/Los_Angeles'
      }),
    dt: date.toLocaleDateString(TF.en,
      {
        weekday: TF.short,
        day    : TF.numeric,
        month  : TF.numeric,
        year   : TF.numeric, 
        //timeZone: 'America/Los_Angeles'
      })
  });
  const [datetime, SetDatetime] = useState(getDatetime());
  useInterval(() => {
    /*
    const tm = date.getHours()     + ":"
             + date.getMinutes()   + ":"
             + date.getSeconds();
    const dt = date.getDate()      + "/"
             + (date.getMonth()+1) + "/"
             + date.getFullYear();
    */
    SetDatetime(getDatetime());
  }, 1000);

  return (
    <>
      <span className="tmf">{datetime.tm}</span><br/>
      <span className="dtf">{datetime.dt}</span>
    </>
  );
}

function App() {
  const aniClass = [
    "ca2",
    "ca1",
    "ca3",
  ];
  const [ani, setAni] = useState(0);
  const ws = useWindowSize();
  const rainbow = op => [  // Roy G. Biv
    `rgba(148,0,  211,${op})`, // Violet
    `rgba(75, 0,  130,${op})`, // Indigo
    `rgba(0,  0,  255,${op})`, // Blue
    `rgba(0,  255,0,  ${op})`, // Green
    `rgba(255,255,0,  ${op})`, // Yellow
    `rgba(255,127,0,  ${op})`, // Orange
    `rgba(255,0,  0,  ${op})`, // Red
  ];
  const blues = op => [
    `rgba(0,  0,  128,${op})`, // Navy
    `rgba(0,  0,  255,${op})`, // Blue
    `rgba(255,0,  255,${op})`, // Magenta
    `rgba(138,43, 226,${op})`, // BlueViolet
    `rgba(0,  0,  205,${op})`, // MediumBlue
  ];

  const R = (ws.w < 400) ? 70 : 90;  // check only once at the start
  
  return (
    <div className="App" onDoubleClick={()=>setAni((ani + 1) % aniClass.length)}>
      <StarryNight width={ws.w} height={ws.h} />
      <div className="ctxt"
        style={{'--ra': R + 'px'}}
      >
        <div style={{transform: `translateY(${floor(R * .5)}px)`}}>
          <Datetime /><br/><br/>
          <span className="stq">SpacetimeQ</span><br/>
          <span className="s3d">Symbolic<span className="tail">3D</span></span>
        </div>
      </div>
      <NeonColors ani={aniClass[ani]} colors={blues(isSafari ? .5 : 1)}  ra={floor(R * 1.3)} dr={2} t={3} />
      <NeonColors ani={aniClass[ani]} colors={rainbow(.3)}               ra={floor(R * 1.5)} dr={2} t={40} />
    </div>
  );
}

export default App;
