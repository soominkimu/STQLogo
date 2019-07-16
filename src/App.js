import React, { useState, useRef } from 'react';
import { copyright, useWindowSize, useInterval, detectBrowser } from './util-ui';
import { BackDrop } from './effects';
import { floor }    from './util-math';
import './App.scss';

copyright("Logo v0,2");

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
      const PB = '■■■■■■■■■■■■■■■■■■■■■■■■';  // ASCII 254 ■
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
  const r1El = useRef(null);  // imperative control of DOM, not to re-render (need to kepp CSS animation)
  const r2El = useRef(null);

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
  const cY = ws.h * .5;
  const transCY = `translateY(${cY}px)`;
  
  // should be applied on the wrapper <div> and not on the CSS animation layer (so that not to override transfrom)
  const setAni = (r1, r2) => {  // Direct DOM manipulation without rendering
    const aniFm = (sc, op) => `transform: scale(${sc}); opacity:${op};`;
    const aniSt = [
      aniFm(1,   1),
      aniFm(1.7, .2),
      aniFm(0,   0)
    ];
    r1El.current.setAttribute("style", aniSt[r1]);  // r1El.current.style = aniSt[r1];
    r2El.current.setAttribute("style", aniSt[r2]);
  };

  console.log("render");

  return (
    <div className="App">
      <BackDrop width={ws.w} height={ws.h} />
      <div className="proto">
        <ul>
          <li data-b="✨"><a href="https://test.spacetimeq.com">SpacetimeQ Experiments</a></li>
          <li data-b="✨"><a href="https://spacetimeq.github.io">Calendar 3D Demo</a></li>
          <li data-b="HOT🔥"><span className="hot"></span>
            <a href="https://demo.spacetimeq.com">Video/Webcam Editor Prototype</a>
          </li>
        </ul>
        <p><span>Tips</span> Double Click to change the background scene.</p>
      </div>
      <div className="l3" style={{transform: transCY}}>
        <div className="l2">
          <div className="l1" style={{opacity: 1}}
            onMouseEnter={()=>setAni(1,1)}
            onMouseLeave={()=>setAni(0,0)}
          >
            <div className="ctxt" style={{'--ra': R + 'px'}}>
              <div style={{transform: `translateY(${floor(R * .5)}px)`}}>
                <Datetime /><br/>
                <span className="stq">Spacetime<span className="tail">Q</span></span><br/>
                <span className="s3d">Symbolic<span className="tail">3D</span></span>
              </div>
            </div>
          </div>
          <div ref={r1El} className="l1">
            <NeonColors ani="ca1" colors={blues(isSafari ? .5 : 1)} ra={floor(R * 1.3)} dr={2} t={3} />
            <NeonColors ani="ca1" colors={rainbow(.3)}              ra={floor(R * 1.5)} dr={2} t={40} />
          </div>
          <div ref={r2El} className="l1">
            <NeonColors ani="ca2" colors={blues(isSafari ? .5 : 1)} ra={floor(R * 1.3)} dr={2} t={3} />
            <NeonColors ani="ca2" colors={rainbow(.3)}              ra={floor(R * 1.5)} dr={2} t={40} />
          </div>
        </div>
      </div>
      <div className="btn-cont"
           style={{transform: `translateY(${cY + R * 3}px)`}}>
        <TBtn onClick={()=>setAni(0,0)} />
        <TBtn onClick={()=>setAni(1,1)} />
        <TBtn onClick={()=>setAni(0,1)} />
        <TBtn onClick={()=>setAni(1,0)} />
        <TBtn onClick={()=>setAni(2,0)} />
        <TBtn onClick={()=>setAni(0,2)} />
        <TBtn onClick={()=>setAni(2,2)} />
      </div>
    </div>
  );
}
//, 

const TBtn = props => <button type="button" className="test-btn" {...props}>{props.children}</button>;

export default App;
