import React, { useState, useRef } from 'react';
import { copyright, useWindowSize, useInterval, detectBrowser } from './util-ui';
import { StarryNight } from './effects';
import { floor } from './util-math';
import './App.scss';

copyright("Logo v0,1");

// Safari shows conflicting animation for the overlapped circles.
// 0: Chrome, 1: Safari, 2: Firefox
const isSafari = detectBrowser() === 1;

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
    dow: date.getDay(),  // Sun - Sat: 0 - 6
    hrs: date.getHours()  // elapsed seconds
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

  // Making this use-defined component <ProgressHours nH={} /> causes re-render every second
  const progressHours = nH => {
    const pgb = n => {
      const PB = '■■■■■■■■■■■■■■■■■■■■■■■■';  // ASCII 254 ■
      //console.log(n);
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

function App() {
  const ani = useRef(null);

  const ws = useWindowSize();
  const rainbow = op => [  // Roy G. Biv
    `rgba(148,0,  211,${op})`, // Violet
    //`rgba(75, 0,  130,${op})`, // Indigo
    `rgba(0,  0,  255,${op})`, // Blue
    `rgba(0,  255,0,  ${op})`, // Green
    `rgba(255,255,0,  ${op})`, // Yellow
    //`rgba(255,127,0,  ${op})`, // Orange
    `rgba(255,0,  0,  ${op})`, // Red
  ];
  const blues = op => [
    `rgba(0,  0,  128,${op})`, // Navy
    `rgba(0,  0,  255,${op})`, // Blue
    `rgba(255,0,  255,${op})`, // Magenta
    //`rgba(138,43, 226,${op})`, // BlueViolet
    //`rgba(0,  0,  205,${op})`, // MediumBlue
  ];

  const R = (ws.w < 400) ? 76 : 90;  // check only once at the start
  // onClick={()=>void(0)}  // mobile Safari hover
  return (
    <div className="App" onDoubleClick={()=>{ani.current.style=`--op: .2; transform: translateY(450px) scale(2);`;}}>
      <StarryNight width={ws.w} height={ws.h} />
      <div className="neon" style={{opacity: 1}}>
        <div className="ctxt"
          style={{'--ra': R + 'px'}}
        >
          <div style={{transform: `translateY(${floor(R * .5)}px)`}}>
            <Datetime /><br/>
            <span className="stq">Spacetime<span className="tail">Q</span></span><br/>
            <span className="s3d">Symbolic<span className="tail">3D</span></span>
          </div>
        </div>
      </div>
      <div className="ctxt"
        style={{'--ra': R * .8 + 'px', top: '650px'}}
      >
        <div style={{transform: `translateY(${floor(R * .5)}px)`}}>
          <Datetime /><br/>
        </div>
      </div>
      <div className="neon">
        <NeonColors ani="ca2" colors={blues(isSafari ? .5 : 1)} ra={floor(R * 1.3)} dr={2} t={3} />
        <NeonColors ani="ca2" colors={rainbow(.3)}              ra={floor(R * 1.5)} dr={2} t={40} />
      </div>
      <div ref={ani} className="neon opct" style={{transform: `translateY(450px)`}}>
        <NeonColors ani="ca1" colors={blues(isSafari ? .5 : 1)} ra={floor(R * 1.3)} dr={2} t={3} />
        <NeonColors ani="ca1" colors={rainbow(.3)}              ra={floor(R * 1.5)} dr={2} t={40} />
      </div>
      <button type="button" onClick={()=>{ani.current.style=`--op: 1; transform: translateY(450px) scale(1);`}}style={{background: 'white', zIndex: "2000"}}>Test</button>
    </div>
  );
}

export default App;
