import React, { useRef } from 'react';
import { copyright,
         useWindowSize } from './util-ui';
import { BackDrop }      from './effects';
import { AniNeonColors } from './ani-neon';
import { ClockProgBar }  from './clock-pb';
import { ArticlesList }  from './articles';
import './App.scss';

copyright("Logo v0.3");

function App() {
  const rEA = [   // imperative control of DOM, not to re-render (in order to kepp CSS animation)
    useRef(null), // ref to the two DOM <div> elements that contain the colors animation objects
    useRef(null)  // that differ in CSS animation
  ];

  const ws = useWindowSize();

  const R = (ws.w < 400) ? 76 : 90;  // check only once at the start
  // onClick={()=>void(0)}  // mobile Safari hover
  const cY = ws.h * .5;
  
  // should be applied on the wrapper <div> and not on the CSS animation layer (so that not to override transfrom)
  const setAni = (r0, r1) => {  // Direct DOM manipulation without rendering
    const param = [ // parameters for the transform { scale, opacity }
      {sc: 1,   op: 1},
      {sc: 1.7, op: 1},
      {sc: 0,   op: 0},
    ];
    const setStyle = (rEl, p) =>
      rEl.current.setAttribute("style", `transform: scale(${p.sc}); opacity:${p.op};`);

    setStyle(rEA[0], param[r0]);
    setStyle(rEA[1], param[r1]);
  };

  const Controls = () => {
    const aniList = [ // variations of the transform parameters (indexed)
      [0,0],[1,1],[0,1],[1,0],[2,0],[0,2],[2,2]
    ];
    return (
      <div className="btn-cont"
           style={{transform: `translateY(${cY + R * 3}px)`}}>
           {aniList.map(a =>
             <button type="button" className="test-btn" onClick={()=>setAni(a[0], a[1])} />)}
      </div>
    );
  }

  console.log("App::render");

  return (
    <div className="App">
      <BackDrop width={ws.w} height={ws.h} />
      <ArticlesList />
      <div className="l3" style={{transform: `translateY(${cY}px)`}}>
        <div className="l2">
          <div className="l1" style={{opacity: 1}}
            onMouseEnter={()=>setAni(1,1)}
            onMouseLeave={()=>setAni(0,0)}
          >
            <div className="ctxt" style={{'--ra': R + 'px'}}>
              <div style={{transform: `translateY(${Math.floor(R * .5)}px)`}}>
                <ClockProgBar /><br/>
                <span className="stq">Spacetime<span className="tail">Q</span></span><br/>
                <span className="s3d">Symbolic<span className="tail">3D</span></span>
              </div>
            </div>
          </div>
          <AniNeonColors rEl={rEA[0]} ani="ca1" R={R} />
          <AniNeonColors rEl={rEA[1]} ani="ca2" R={R} />
        </div>
      </div>
      <Controls />
    </div>
  );
}

export default App;
