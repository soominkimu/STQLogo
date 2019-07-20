import React, { useRef } from 'react';
import { copyright,
         useWindowSize } from './lib/util-ui';
import { BackDrop }      from './lib/effects';
import { AniNeonColors } from './ani-neon';
import { ClockProgBar }  from './clock-pb';
import { ArticlesList }  from './articles';
import { useFetchData,
         DATA }          from './prepare-data';
import './App.scss';

copyright("Logo v0.4");

/*
 * Basically we have two classes of animations defined in css:
 * animation classes: "ani1": ani-cloud, "ani2": ani-hair
 * And then, three types of transforms (scale and opacity) are applied to each of the two animations
 * with the combinations defined in anidef.json file.
*/

function App() {
  const rEA = [   // imperative control of DOM, not to re-render (in order to kepp CSS animation)
    useRef(null), // ref to the two DOM <div> elements that contain the colors animation objects
    useRef(null)  // that differ in CSS animation
  ];

  const [dataReady, setDataReady] = React.useState(false);

  useFetchData(error => {  // run only once in the beginning
    if (error) {
      window.alert(error);
      return;
    }
    setDataReady(true);
  });

  const ws = useWindowSize();  // window size change will cause to re-render

  const R = (ws.w < 400) ? 76 : 90;  // check only once at the start
  // onClick={()=>void(0)}  // mobile Safari hover
  const cY = ws.h * .5;
  
  // requires "transform" in anidef.json (parameters for the transform)
  // should be applied on the wrapper <div> and not on the CSS animation layer (so that not to override transfrom)
  const setAniCombi = ac => {  // Direct DOM manipulation without rendering
    const setStyle = (rEl, p) =>
      rEl.current.setAttribute("style", `transform: scale(${p.scale}); opacity:${p.opacity};`);

    setStyle(rEA[0], DATA.anidef.transform[ac.ref0]);
    setStyle(rEA[1], DATA.anidef.transform[ac.ref1]);
  }

  // requires "combination" in anidef.json: variations of the transform parameters (indexed)
  const Controls = () =>
    <div className="btn-cont"
         style={{transform: `translateY(${cY + R * 3}px)`}}>
         {DATA.anidef.combination.map( (ac, i) =>
           <button key={i} type="button" className="test-btn"
             onClick={()=>setAniCombi(ac)}
           /> )
         }
    </div>;

  console.log("App::render");

  if (!dataReady) {
    return (
      <div className="App">
        <p className="msg-prepare">SpacetimeQ loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <BackDrop width={ws.w} height={ws.h} />
      <ArticlesList />
      <div className="l3" style={{transform: `translateY(${cY}px)`}}>
        <div className="l2">
          <div className="l1" style={{opacity: 1}}
            onMouseEnter={()=>setAniCombi(DATA.anidef.combination[1])}
            onMouseLeave={()=>setAniCombi(DATA.anidef.combination[0])}
          >
            <div className="ctxt" style={{'--ra': R + 'px'}}>
              <div style={{transform: `translateY(${Math.floor(R * .5)}px)`}}>
                <ClockProgBar /><br/>
                <span className="stq">Spacetime<span className="tail">Q</span></span><br/>
                <span className="s3d">Symbolic<span className="tail">3D</span></span>
              </div>
            </div>
          </div>
          <AniNeonColors factor={DATA.anidef.factor} rEl={rEA[0]} ani="ca1" R={R} />
          <AniNeonColors factor={DATA.anidef.factor} rEl={rEA[1]} ani="ca2" R={R} />
        </div>
      </div>
      <Controls />
    </div>
  );
}

export default App;
