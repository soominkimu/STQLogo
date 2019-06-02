import React, { useRef, useEffect } from 'react';
import { useWindowSize } from './util-ui';
import {
  randomRange, randomInt, randomElement, τ
} from './util-math';
import './App.scss';

(function() { // ASCII ART: http://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20
  console.log("╔═╗┌─┐┌─┐┌─┐┌─┐┌┬┐┬┌┬┐┌─┐╔═╗  Logo v0.1 - contact: dev.spacetimeq@gmail.com");
  console.log("╚═╗├─┘├─┤│  ├┤  │ ││││├┤ ║═╬╗", Date());
  console.log("╚═╝┴  ┴ ┴└─┘└─┘ ┴ ┴┴ ┴└─┘╚═╝╚ (C)2019 SpacetimeQ Inc, CA 94583");
})();  // IIFE

// Actually, we don't have to regenerate the pattern for each screen resize.
// If we can save the result, just repaint with the same pattern for the new screen.
const StarryNight = props => {
  const canvasRef = useRef(null);
  const txtCvsRef = useRef(document.createElement('canvas'));
  const txtW = 301;

  useEffect(() => {
    const txtCvs = txtCvsRef.current;  // texture buffer canvas, offscreen
    txtCvs.width  = txtW - 1;
    txtCvs.height = txtW - 1;
    const txt = txtCvs.getContext('2d', { alpha: false });  // no transparent, to optimize rendering

    const randomHue = () => randomElement( [0, 30, 60, 90, 120, 180, 240] );  // colors
    const stars = 300 + randomInt( 200 );

    txt.clearRect(0, 0, txtCvs.width, txtCvs.height);  // Otherwise the pattern will be accumulated
    for (let i=0; i < stars; i++) {
      txt.beginPath();
      txt.arc(randomInt( txtW ), randomInt( txtW ), randomRange(.1, .9, 2), 0, τ);
      txt.fillStyle = `hsla(${randomHue()},${50 + randomInt( 50 )}%,88%,${randomRange(.4, 1-.4, 2)})`;
      txt.fill();  // fill() was faster than stroke()
    }
    console.log(`${stars} stars generated in ${txtW-1}x${txtW-1} pattern.`);
  }, []); // initialize only once

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpah: false });
    ctx.fillStyle = ctx.createPattern(txtCvsRef.current, 'repeat');  // create pattern from txtCvs canvas in ctx
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [props.width, props.height]);  // only when size changes

  return (
    <canvas ref={canvasRef} width={props.width} height={props.height} />
  );
}

const NeonCircle = props =>
  <div className="ca"
    style={{
      '--ra': props.ra + 'px',
      '--cl': props.color,
      '--t' : props.t + 's'
    }}
  >
    {props.children}
  </div>;

const NeonColors = ({colors, ra, dr=12, t=0}) => {
  const lns = [];
  colors.forEach((c, i) =>
    lns.push( <NeonCircle key={i} ra={ra + dr*i} color={c} t={t + i} ></NeonCircle>));

  return ( <> {lns} </>);
}

/*
const Demo = () =>
  <>
    <NeonCircle ra={10}  color={rgb(255, 0, 0)}   t={0} />
    <NeonCircle ra={100} color={rgb(255, 0, 255)} t={2} />
    <NeonCircle ra={150} color={rgb(0,   0, 255)} t={5} />
    <NeonCircle ra={250} color={rgb(178, 34, 34)} t={10} />
  </>;
*/

function App() {
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
    `rgba(135,206,235,${op})`, // SkyBlue
    `rgba(65, 105,225,${op})`, // RoyalBlue
    `rgba(0,  0,  205,${op})`, // MediumBlue
  ];

  // 0: Chrome, 1: Safari, 2: Firefox
  const detectBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1)
      return (ua.indexOf('chrome') > -1) ? 0 : 1;
    if (ua.indexOf('firefox'))
      return 2;
    return -1;
  }

  // Safari does not show correctly overlapped circles.
  const isSafari = detectBrowser() === 1;
  const R  = 100;
  
  return (
    <div className="App">
      <StarryNight width={ws.w} height={ws.h} />
      <div className="ctxt"
        style={{'--ra': R + 'px'}}
      >
        <div style={{transform: `translateY(${R-20}px)`}}>
          <span className="stq">SpacetimeQ</span>
          <br/>
          <span className="s3d">Symbolic<span className="tail">3D</span></span>
        </div>
      </div>
      <NeonColors colors={isSafari ? blues(1).slice(0, 1) : blues(1)} ra={R + 20} dr={0} t={5} />
      <NeonColors colors={rainbow(.3)} ra={R + 60} dr={isSafari ? 10 : 0} t={60} />
    </div>
  );
}

/*
*/

export default App;
